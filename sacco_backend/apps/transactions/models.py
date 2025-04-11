# apps/transactions/models.py
from django.db import models
from apps.members.models import Member
from shared.mixins.model_mixins import AuditMixin


class Transaction(AuditMixin):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Cash Deposit'),
        ('WITHDRAWAL', 'Cash Withdrawal'),
        ('LOAN_DISBURSEMENT', 'Loan Disbursement'),
        ('LOAN_REPAYMENT', 'Loan Repayment'),
        ('TRANSFER', 'Internal Transfer'),
        ('INTEREST', 'Interest Credit'),
        ('FEE', 'Service Fee')
    ]

    PAYMENT_METHODS = [
        ('CASH', 'Cash'),
        ('MOBILE_MONEY', 'Mobile Money'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('INTERNAL', 'Internal Transfer')
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REVERSED', 'Reversed')
    ]

    transaction_ref = models.CharField(max_length=50, unique=True)
    member = models.ForeignKey(Member, on_delete=models.PROTECT)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    # For transfers
    source_account = models.CharField(max_length=50, null=True)
    destination_account = models.CharField(max_length=50, null=True)

    # For mobile money/bank transfers
    external_reference = models.CharField(max_length=50, null=True)
    provider_reference = models.CharField(max_length=50, null=True)

    description = models.TextField(null=True)
    processed_date = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['transaction_ref']),
            models.Index(fields=['member', '-created_at']),
            models.Index(fields=['status', '-created_at'])
        ]


class TransactionFee(models.Model):
    transaction_type = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=20)
    fixed_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)


class TransactionLimit(models.Model):
    LIMIT_TYPES = [
        ('DAILY', 'Daily Limit'),
        ('SINGLE', 'Single Transaction'),
        ('MONTHLY', 'Monthly Limit')
    ]

    transaction_type = models.CharField(max_length=20)
    limit_type = models.CharField(max_length=20, choices=LIMIT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    member_type = models.CharField(max_length=20)  # Regular, Premium, etc.