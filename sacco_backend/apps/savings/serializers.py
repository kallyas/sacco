# apps/savings/serializers.py
from rest_framework import serializers

from apps.savings.models import SavingsAccount, SavingsTransaction


class SavingsAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsAccount
        fields = '__all__'
        read_only_fields = ['balance', 'last_interest_date']


class SavingsTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsTransaction
        fields = '__all__'
        read_only_fields = ['balance_after', 'reference']


