from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Loan, LoanApplication, LoanRepayment
from .serializers import LoanSerializer, LoanApplicationSerializer, LoanRepaymentSerializer
from .services.loan_service import LoanService


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = []

    def get_queryset(self):
        if self.request.user.role.name == 'LOAN_OFFICER':
            return Loan.objects.all()
        return Loan.objects.filter(member__user=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'PENDING':
            return Response(
                {'error': 'Only pending loans can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        loan = LoanService.approve_loan(loan, request.user)
        return Response(LoanSerializer(loan).data)

    @action(detail=True, methods=['post'])
    def disburse(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'APPROVED':
            return Response(
                {'error': 'Only approved loans can be disbursed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        loan = LoanService.disburse_loan(loan)
        return Response(LoanSerializer(loan).data)


class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all()
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated]


class LoanRepaymentViewSet(viewsets.ModelViewSet):
    queryset = LoanRepayment.objects.all()
    serializer_class = LoanRepaymentSerializer
    permission_classes = [IsAuthenticated]
