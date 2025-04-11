from django.db import models

from shared.mixins.model_mixins import AuditMixin


class Report(AuditMixin):
    REPORT_TYPES = [
        ('FINANCIAL', 'Financial Report'),
        ('MEMBER', 'Member Report'),
        ('LOAN', 'Loan Report'),
        ('TRANSACTION', 'Transaction Report'),
        ('COMPLIANCE', 'Compliance Report'),
        ('AUDIT', 'Audit Report')
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('GENERATING', 'Generating'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed')
    ]

    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    name = models.CharField(max_length=100)
    parameters = models.JSONField(default=dict)
    file = models.FileField(upload_to='reports/', null=True)
    format = models.CharField(max_length=10)  # PDF, XLSX, CSV
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    error_message = models.TextField(null=True)

    class Meta:
        indexes = [
            models.Index(fields=['report_type', 'status']),
            models.Index(fields=['start_date', 'end_date'])
        ]

    def __str__(self):
        return self.name

class ReportSchedule(AuditMixin):
    FREQUENCY_CHOICES = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly')
    ]

    report_type = models.CharField(max_length=20)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    parameters = models.JSONField(default=dict)
    recipients = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    last_run = models.DateTimeField(null=True)
    next_run = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=['report_type', 'frequency', 'is_active'])
        ]

    def __str__(self):
        return f'{self.report_type} - {self.frequency}'