# apps/savings/models.py
from django.db import models

from apps import members


class SavingsAccount(models.Model):
    ACCOUNT_TYPES = [
        ('REGULAR', 'Regular Savings'),
        ('FIXED', 'Fixed Deposit'),
        ('CHILDREN', 'Children Savings'),
        ('GROUP', 'Group Savings')
    ]

    member = models.ForeignKey(
        'members.Member',
        on_delete=models.CASCADE,
        related_name='all_savings_accounts'  # Added related_name
    )
    account_number = models.CharField(max_length=20, unique=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=20)
    minimum_balance = models.DecimalField(max_digits=12, decimal_places=2)
    date_opened = models.DateTimeField(auto_now_add=True)
    last_interest_date = models.DateTimeField(null=True)


class SavingsTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
        ('INTEREST', 'Interest Credit'),
        ('CHARGE', 'Service Charge')
    ]

    account = models.ForeignKey(SavingsAccount, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=50, unique=True)


class InterestRate(models.Model):
    account_type = models.CharField(max_length=20)
    minimum_balance = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    effective_date = models.DateField()


