from django.db import models

from apps.transactions.models import Transaction


class LedgerEntry(models.Model):
    ENTRY_TYPES = [
        ('DEBIT', 'Debit'),
        ('CREDIT', 'Credit')
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.PROTECT)
    account_code = models.CharField(max_length=20)
    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction.transaction_ref} - {self.entry_type}"