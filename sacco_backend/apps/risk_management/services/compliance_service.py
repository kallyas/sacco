from decimal import Decimal

from django.utils import timezone

from apps.members.models import Member
from apps.notifications.services.notification_service import NotificationService
from apps.risk_management.models import ComplianceReport
from apps.risk_management.services.risk_assessment_service import RiskAssessmentService
from apps.transactions.models import Transaction


class ComplianceService:
    @staticmethod
    async def check_aml_compliance(transaction: Transaction) -> bool:
        threshold = Decimal('10000000')  # 10M UGX

        if transaction.amount >= threshold:
            # Create AML report
            await ComplianceService._create_aml_report(transaction)

            # Notify compliance officer
            await NotificationService.notify_compliance_officer(
                'AML_ALERT',
                {'transaction_id': transaction.id}
            )

            return False
        return True

    @staticmethod
    async def _create_aml_report(transaction: Transaction) -> None:
        report = {
            'transaction_id': transaction.id,
            'date': timezone.now().isoformat(),
            'member': {
                'id': transaction.member.id,
                'name': transaction.member.user.get_full_name(),
                'kyc_status': await ComplianceService.verify_kyc(transaction.member)
            },
            'transaction_details': {
                'amount': float(transaction.amount),
                'type': transaction.transaction_type,
                'reference': transaction.transaction_ref
            },
            'risk_factors': await RiskAssessmentService.identify_risk_factors(transaction.member)
        }

        # Store report in compliance database
        await ComplianceReport.objects.acreate(
            transaction=transaction,
            report_type='AML',
            content=report
        )