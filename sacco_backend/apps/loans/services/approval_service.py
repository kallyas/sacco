from django.db import transaction
from ..models import LoanApplication, Loan
from apps.risk_management.services.risk_assessment_service import RiskAssessmentService


class LoanApprovalService:
    """
    Handles loan approval decisions and processing based on risk assessment and pre-defined
    business rules.

    This service processes loan applications by evaluating the associated risk score,
    making approval or rejection decisions, and performing necessary actions such as creating
    a loan record for approved applications. The service ensures atomic transactionality
    to maintain data consistency throughout the process.

    Methods:
        - process_application: Processes the loan application, evaluates risk, makes a decision,
          updates the application, and potentially creates a loan.
        - _make_decision: Determines the approval decision based on the risk score.
        - _create_loan: Creates a new loan record for an approved application.
    """
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
        """
        Makes a decision on a loan application based on the provided risk score. The decision is
        determined by predefined thresholds of the credit risk score.

        The function evaluates whether an application is automatically approved, automatically
        rejected, or requires manual review based on the provided risk score.

        Args:
            application (LoanApplication): The loan application to be evaluated.
            Risk_score (int): The applicant's credit risk score.

        Returns:
            dict: A dictionary containing the decision 'status' and associated 'notes'.
        """
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


