from rest_framework import serializers

from apps.risk_management.models import RiskProfile, FraudAlert


class RiskProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskProfile
        fields = '__all__'
        read_only_fields = ['credit_score', 'risk_level', 'last_assessment_date']

class FraudAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudAlert
        fields = '__all__'
        read_only_fields = ['alert_date', 'resolved']