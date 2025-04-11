# shared/validators/custom_validators.py
import re
from decimal import Decimal

from django.core.exceptions import ValidationError


class SACCOValidators:
    @staticmethod
    def validate_member_number(value):
        pattern = r'^M\d{4}[A-Z0-9]{6}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid member number format (MYYYY######)')

    @staticmethod
    def validate_loan_reference(value):
        pattern = r'^LN\d{8}[A-Z0-9]{4}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid loan reference format (LNYYYYMMDD####)')

    @staticmethod
    def validate_transaction_reference(value):
        pattern = r'^TXN\d{8}[A-Z0-9]{8}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid transaction reference format (TXNYYYYMMDD########)')

    @staticmethod
    def validate_savings_account_number(value):
        pattern = r'^SAV\d{4}\d{6}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid savings account number format (SAVYYYY######)')

    @staticmethod
    def validate_loan_amount(value, member):
        max_amount = member.monthly_income * 12
        if value > max_amount:
            raise ValidationError(f'Loan amount cannot exceed annual income ({max_amount})')

    @staticmethod
    def validate_repayment_period(value, loan_type):
        max_periods = {
            'PERSONAL': 24,
            'BUSINESS': 36,
            'EMERGENCY': 6,
            'EDUCATION': 48
        }
        if value > max_periods.get(loan_type, 24):
            raise ValidationError(f'Maximum repayment period for {loan_type} is {max_periods[loan_type]} months')

    @staticmethod
    def validate_business_hours(value):
        if not (9 <= value.hour < 17):
            raise ValidationError('Operation must be within business hours (9 AM - 5 PM)')

    @staticmethod
    def validate_guarantor(guarantor, loan):
        if guarantor == loan.member:
            raise ValidationError('Member cannot be their own guarantor')
        if guarantor.savings_account.balance < (loan.amount * Decimal('0.25')):
            raise ValidationError('Guarantor must have at least 25% of loan amount in savings')