# apps/loans/models.py
from django.conf import settings
from django.db import models

from apps.members.models import Member


class Loan(models.Model):
    LOAN_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('DISBURSED', 'Disbursed'),
        ('COMPLETED', 'Completed'),
        ('DEFAULTED', 'Defaulted')
    ]

    reference = models.CharField(max_length=50, unique=True)
    disbursement_transaction = models.OneToOneField(
        'transactions.Transaction',
        on_delete=models.PROTECT,
        null=True,
        related_name='loan_disbursement'
    )
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    loan_type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField()
    status = models.CharField(max_length=20, choices=LOAN_STATUS_CHOICES)
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True)
    disbursement_date = models.DateTimeField(null=True)
    total_amount_payable = models.DecimalField(max_digits=12, decimal_places=2)
    total_interest = models.DecimalField(max_digits=12, decimal_places=2)
    outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2)
    next_payment_date = models.DateField(null=True)
    last_payment_date = models.DateField(null=True)
    missed_payments_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['-application_date']

    def __str__(self):
        return f'{self.loan_type} - {self.amount}'

class LoanApplication(models.Model):
    APPLICATION_STATUS = [
        ('PENDING', 'Pending'),
        ('IN_REVIEW', 'In Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    ]

    member = models.ForeignKey('members.Member', on_delete=models.CASCADE)
    loan_type = models.CharField(max_length=50)
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    purpose = models.TextField()
    collateral_details = models.TextField(null=True, blank=True)
    employment_details = models.TextField()
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    credit_score = models.IntegerField(null=True)
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS, default='PENDING')
    submitted_date = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    review_date = models.DateTimeField(null=True)
    review_notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-submitted_date']

    def __str__(self):
        return f'{self.loan_type} - {self.amount_requested}'


class LoanRepayment(models.Model):
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed')
    ]

    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    transaction = models.OneToOneField(
        'transactions.Transaction',
        on_delete=models.PROTECT,
        null=True,
        related_name='loan_repayment'
    )
    reference = models.CharField(max_length=50, unique=True)
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    principal_component = models.DecimalField(max_digits=12, decimal_places=2)
    interest_component = models.DecimalField(max_digits=12, decimal_places=2)
    penalty_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_date = models.DateTimeField(null=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    payment_method = models.CharField(max_length=20, null=True)
    receipt_number = models.CharField(max_length=50, null=True)
    remarks = models.TextField(null=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f'{self.loan.reference} - {self.amount}'
