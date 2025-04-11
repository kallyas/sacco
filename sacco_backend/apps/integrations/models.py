from django.db import models

from apps import members


class USSDSession(models.Model):
    SESSION_STATUS = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('EXPIRED', 'Expired')
    ]

    session_id = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=15)
    member = models.ForeignKey('members.Member', on_delete=models.CASCADE, null=True)
    current_menu = models.CharField(max_length=50)
    session_data = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=SESSION_STATUS)
    started_at = models.DateTimeField(auto_now_add=True)
    last_access = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.phone_number} - {self.session_id}"


class IntegrationProvider(models.Model):
    PROVIDER_TYPES = [
        ('PAYMENT', 'Payment Gateway'),
        ('SMS', 'SMS Gateway'),
        ('CREDIT_BUREAU', 'Credit Bureau'),
        ('BANK', 'Bank Integration')
    ]

    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    is_active = models.BooleanField(default=True)
    config = models.JSONField()
    api_key = models.CharField(max_length=255, null=True)
    api_secret = models.CharField(max_length=255, null=True)
    webhook_url = models.URLField(null=True)
    webhook_secret = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"{self.name} - {self.provider_type}"


class PaymentTransaction(models.Model):
    TRANSACTION_STATUS = [
        ('INITIATED', 'Initiated'),
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed')
    ]

    provider = models.ForeignKey(IntegrationProvider, on_delete=models.PROTECT)
    internal_reference = models.CharField(max_length=50, unique=True)
    provider_reference = models.CharField(max_length=50, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='UGX')
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS)
    callback_data = models.JSONField(null=True)
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.internal_reference} - {self.amount} {self.currency}"