import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from apps.members.models import Member
from apps.risk_management.services.fraud_detection_service import FraudDetectionService
from apps.risk_management.services.risk_assessment_service import RiskAssessmentService
from apps.transactions.models import Transaction

logger = logging.getLogger(__name__)

@shared_task
def daily_risk_assessment():
    members = Member.objects.filter(
        riskprofile__next_assessment_date__lte=timezone.now()
    )

    for member in members:
        try:
            RiskAssessmentService.assess_member_risk(member.id)
        except Exception as e:
            logger.error(f"Risk assessment failed for member {member.id}: {str(e)}")


@shared_task
def monitor_suspicious_activities():
    timeframe = timezone.now() - timedelta(hours=24)
    transactions = Transaction.objects.filter(created_at__gte=timeframe)

    for transaction in transactions:
        try:
            FraudDetectionService.analyze_transaction(transaction)
        except Exception as e:
            logger.error(f"Fraud detection failed for transaction {transaction.id}: {str(e)}")


