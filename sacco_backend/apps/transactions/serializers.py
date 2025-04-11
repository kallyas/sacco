from rest_framework import serializers

from apps.transactions.models import Transaction, TransactionFee


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['transaction_ref', 'status', 'processed_date']

class TransactionFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionFee
        fields = '__all__'