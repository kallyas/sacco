from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Member, NextOfKin, MemberDocument
from .serializers import MemberSerializer, NextOfKinSerializer, MemberDocumentSerializer
from .services.member_service import MemberService


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request):
        member_data = request.data.get('member', {})
        next_of_kin_data = request.data.get('next_of_kin', [])

        try:
            member = MemberService.register_member(
                request.user,
                member_data,
                next_of_kin_data
            )
            return Response(
                MemberSerializer(member).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def me(self, request):
        member = Member.objects.filter(user=request.user).first()
        if not member:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(MemberSerializer(member).data)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        member = self.get_object()
        serializer = MemberDocumentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(member=member)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        member = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        updated_member = MemberService.update_member_status(member, new_status)
        return Response(MemberSerializer(updated_member).data)


class NextOfKinViewSet(viewsets.ModelViewSet):
    queryset = NextOfKin.objects.all()
    serializer_class = NextOfKinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NextOfKin.objects.filter(member__user=self.request.user)
