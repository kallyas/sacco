from django.db import transaction
from ..models import LoanApplication, Loan
from apps.risk_management.services import RiskAssessmentService


class LoanApprovalService:
    @staticmethod
    @transaction.atomic
    def process_application(application_id: int, reviewer_id: int) -> LoanApplication:
        application = LoanApplication.objects.select_for_update().get(id=application_id)
        risk_score = RiskAssessmentService.assess_loan_risk(application)

        decision = LoanApprovalService._make_decision(application, risk_score)
        application.status = decision['status']
        application.review_notes = decision['notes']
        application.reviewed_by_id = reviewer_id
        application.save()

        if application.status == 'APPROVED':
            LoanApprovalService._create_loan(application)

        return application

    @staticmethod
    def _make_decision(application: LoanApplication, risk_score: int) -> dict:
        if risk_score >= 700:
            return {'status': 'APPROVED', 'notes': 'Automatically approved - Good credit score'}
        elif risk_score < 500:
            return {'status': 'REJECTED', 'notes': 'Automatically rejected - Poor credit score'}
        else:
            return {'status': 'IN_REVIEW', 'notes': 'Requires manual review'}

    @staticmethod
    def _create_loan(application: LoanApplication) -> Loan:
        return Loan.objects.create(
            member=application.member,
            loan_type=application.loan_type,
            amount=application.amount_requested,
            status='PENDING'
        )


