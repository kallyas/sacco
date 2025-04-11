from django.db import models

from apps import members


# Create your models here.
# apps/notifications/models.py
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('TRANSACTION', 'Transaction Alert'),
        ('LOAN', 'Loan Update'),
        ('ACCOUNT', 'Account Update'),
        ('SYSTEM', 'System Notification')
    ]

    PRIORITY_LEVELS = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High')
    ]

    member = models.ForeignKey('members.Member', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS)
    read = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class NotificationTemplate(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    notification_type = models.CharField(max_length=20)
    priority = models.CharField(max_length=10)
    channels = models.JSONField(default=list)

class NotificationPreference(models.Model):
    member = models.OneToOneField('members.Member', on_delete=models.CASCADE)
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    quiet_hours_start = models.TimeField(null=True)
    quiet_hours_end = models.TimeField(null=True)