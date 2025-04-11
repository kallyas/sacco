# apps/risk_management/services/fraud_notification_service.py
from ...notifications.services.notification_service import NotificationService
from ..models import FraudAlert

async def send_fraud_alert(alert: FraudAlert):
    await NotificationService.send_notification(
        member=alert.member,
        template_code='fraud_alert',
        context={'alert': alert}
    )