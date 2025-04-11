from rest_framework import serializers

from apps.ledger.models import LedgerEntry


class LedgerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerEntry
        fields = '__all__'
        read_only_fields = ['balance_after']

    def validate(self, data):
        if data['amount'] <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")

        if data['entry_type'] not in ['DEBIT', 'CREDIT']:
            raise serializers.ValidationError("Invalid entry type")

        return data


class TrialBalanceSerializer(serializers.Serializer):
    account_code = serializers.CharField()
    account_name = serializers.CharField()
    debit_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    credit_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_balance = serializers.DecimalField(max_digits=12, decimal_places=2)