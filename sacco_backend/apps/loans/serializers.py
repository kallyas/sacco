from rest_framework import serializers
from .models import Loan, LoanApplication, LoanRepayment

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ['status', 'approval_date', 'disbursement_date']

class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = '__all__'
        read_only_fields = ['status', 'reviewed_by', 'review_date']

class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = '__all__'
        read_only_fields = ['processed_date', 'processed_by']