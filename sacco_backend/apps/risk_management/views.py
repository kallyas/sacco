# apps/risk_management/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.risk_management.models import RiskProfile, FraudAlert
from apps.risk_management.serializers import RiskProfileSerializer, FraudAlertSerializer
from apps.risk_management.services.risk_assessment_service import RiskAssessmentService


class RiskProfileViewSet(viewsets.ModelViewSet):
    serializer_class = RiskProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role.name in ['RISK_OFFICER', 'ADMIN']:
            return RiskProfile.objects.all()
        return RiskProfile.objects.none()

    @action(detail=True, methods=['post'])
    async def reassess(self, request, pk=None):
        profile = self.get_object()
        try:
            updated_profile = await RiskAssessmentService.assess_member_risk(profile.member_id)
            return Response(RiskProfileSerializer(updated_profile).data)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class FraudAlertViewSet(viewsets.ModelViewSet):
    serializer_class = FraudAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role.name in ['RISK_OFFICER', 'ADMIN']:
            return FraudAlert.objects.all()
        return FraudAlert.objects.none()

    @action(detail=True, methods=['post'])
    async def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.resolved = True
        alert.resolution_notes = request.data.get('notes')
        await alert.asave()
        return Response(FraudAlertSerializer(alert).data)