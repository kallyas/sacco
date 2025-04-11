from django.conf import settings
from django.db import models

from apps import members, transactions


# Create your models here.
class RiskProfile(models.Model):
    member = models.OneToOneField('members.Member', on_delete=models.CASCADE)
    credit_score = models.IntegerField()
    risk_level = models.CharField(max_length=20)
    last_assessment_date = models.DateTimeField()
    next_assessment_date = models.DateTimeField()
    credit_bureau_report = models.JSONField(null=True)
    factors = models.JSONField()

class RiskAssessment(models.Model):
    member = models.ForeignKey('members.Member', on_delete=models.CASCADE)
    assessment_date = models.DateTimeField(auto_now_add=True)
    credit_score = models.IntegerField()
    risk_factors = models.JSONField()
    recommendations = models.JSONField()
    assessor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

class FraudAlert(models.Model):
    SEVERITY_LEVELS = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical')
    ]

    member = models.ForeignKey('members.Member', on_delete=models.CASCADE)
    alert_date = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    description = models.TextField()
    indicators = models.JSONField()
    resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(null=True)

class ComplianceReport(models.Model):
    REPORT_TYPES = [
        ('AML', 'Anti-Money Laundering'),
        ('KYC', 'Know Your Customer'),
        ('AUDIT', 'Audit Report')
    ]

    transaction = models.ForeignKey('transactions.Transaction', on_delete=models.PROTECT)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
