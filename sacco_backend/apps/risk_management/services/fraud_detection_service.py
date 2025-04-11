from datetime import timedelta
from decimal import Decimal
from typing import Optional

from django.utils import timezone

from apps.risk_management.models import FraudAlert
from apps.risk_management.services.fraud_notification_service import send_fraud_alert
from apps.risk_management.utils.alert_utils import generate_alert_description
from apps.savings.models import SavingsAccount
from apps.transactions.models import Transaction


class FraudDetectionService:
    SUSPICIOUS_PATTERNS = {
        'multiple_accounts': {'threshold': 2, 'timeframe_days': 30},
        'rapid_transactions': {'threshold': 5, 'timeframe_minutes': 60},
        'large_transactions': {'threshold': Decimal('5000000'), 'currency': 'UGX'},
    }

    @staticmethod
    async def analyze_transaction(transaction: Transaction) -> Optional[FraudAlert]:
        indicators = await FraudDetectionService._check_indicators(transaction)

        if indicators:
            severity = FraudDetectionService._calculate_severity(indicators)

            alert = await FraudAlert.objects.acreate(
                member=transaction.member,
                severity=severity,
                description=generate_alert_description(indicators),
                indicators=indicators
            )

            await  send_fraud_alert(alert)
            return alert
        return None

    @staticmethod
    async def _check_indicators(transaction: Transaction) -> dict:
        indicators = {}

        # Check for multiple accounts
        recent_accounts = await SavingsAccount.objects.filter(
            member=transaction.member,
            created_at__gte=timezone.now() - timedelta(
                days=FraudDetectionService.SUSPICIOUS_PATTERNS['multiple_accounts']['timeframe_days']
            )
        ).acount()

        if recent_accounts >= FraudDetectionService.SUSPICIOUS_PATTERNS['multiple_accounts']['threshold']:
            indicators['multiple_accounts'] = recent_accounts

        # Check for rapid transactions
        recent_transactions = await Transaction.objects.filter(
            member=transaction.member,
            created_at__gte=timezone.now() - timedelta(
                minutes=FraudDetectionService.SUSPICIOUS_PATTERNS['rapid_transactions']['timeframe_minutes']
            )
        ).acount()

        if recent_transactions >= FraudDetectionService.SUSPICIOUS_PATTERNS['rapid_transactions']['threshold']:
            indicators['rapid_transactions'] = recent_transactions

        # Check for large transactions
        if transaction.amount >= FraudDetectionService.SUSPICIOUS_PATTERNS['large_transactions']['threshold']:
            indicators['large_transaction'] = float(transaction.amount)

        return indicators

    @staticmethod
    def _calculate_severity(indicators: dict) -> str:
        if 'large_transaction' in indicators and len(indicators) > 1:
            return 'CRITICAL'
        elif len(indicators) >= 2:
            return 'HIGH'
        return 'MEDIUM'

