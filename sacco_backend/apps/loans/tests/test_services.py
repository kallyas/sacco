# apps/loans/tests/test_services.py
import json
from decimal import Decimal
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.authentication.models import Role
from apps.loans.services.loan_service import LoanService
from apps.loans.models import Loan, LoanRepayment
from apps.members.models import Member
from apps.risk_management.models import RiskProfile

User = get_user_model()


class LoanServiceTest(TestCase):
    def setUp(self):
        # Create user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role=Role.objects.create(name='Member', description='Member role')
        )

        # Create member
        self.member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            is_verified=True,
            registration_date=datetime(2023, 1, 1).date(),
            date_of_birth=datetime(1994, 1, 1).date(),
            monthly_income=Decimal('500000.00'),
        )

        # Create loan
        self.loan = Loan.objects.create(
            reference='LN2024TEST001',
            member=self.member,
            loan_type='BUSINESS',
            amount=Decimal('1000000'),
            interest_rate=Decimal('15.00'),
            term_months=12,
            status='PENDING',
            total_amount_payable=Decimal('1150000'),
            total_interest=Decimal('150000'),
            outstanding_balance=Decimal('1150000')
        )

        # Mock NotificationService
        self.notification_patcher = patch('apps.loans.services.loan_service.NotificationService')
        self.mock_notification_service = self.notification_patcher.start()

        # Risk profile
        self.risk_profile = RiskProfile.objects.create(
            member=self.member,
            credit_score=700,
            last_assessment_date=datetime.now(),
            next_assessment_date=datetime.now() + timedelta(days=30),
            factors=json.dumps({
                'income_stability': 'Stable',
                'credit_history': 'Good',
                'debt_to_income_ratio': 'Low',
                'employment_status': 'Employed',
                'savings_balance': 'Good',
                'loan_repayment_history': 'Good',
                'collateral_value': 'High',
            })
        )

    def tearDown(self):
        self.notification_patcher.stop()

    def test_calculate_monthly_payment(self):
        monthly_payment = LoanService.calculate_monthly_payment(
            principal=Decimal('1000000'),
            annual_rate=Decimal('15.00'),
            term_months=12
        )
        self.assertIsInstance(monthly_payment, Decimal)
        self.assertTrue(monthly_payment > 0)
        # Expected monthly payment for this loan (can be calculated manually)
        expected_payment = Decimal('90258.31')
        self.assertEqual(monthly_payment.quantize(Decimal('0.01')), expected_payment)

    def test_loan_approval(self):
        # Test loan approval process
        approved_by = self.user
        approved_loan = LoanService.approve_loan(self.loan, approved_by)

        # Assertions
        self.assertEqual(approved_loan.status, 'APPROVED')
        self.assertIsNotNone(approved_loan.approval_date)
        self.assertEqual(approved_loan.approved_by, approved_by)

        # Verify notification was sent
        self.mock_notification_service.send_loan_approval_notification.assert_called_once_with(self.member)

    def test_loan_disbursement(self):
        # First approve the loan
        LoanService.approve_loan(self.loan, self.user)

        # Test loan disbursement process
        disbursed_loan = LoanService.disburse_loan(self.loan)

        # Assertions
        self.assertEqual(disbursed_loan.status, 'DISBURSED')
        self.assertIsNotNone(disbursed_loan.disbursement_date)

        # Check repayment schedule was created
        repayments = LoanRepayment.objects.filter(loan=disbursed_loan)
        self.assertEqual(repayments.count(), 12)  # 12 monthly payments

        # Verify notification was sent
        self.mock_notification_service.send_loan_disbursement_notification.assert_called_once_with(self.member)

    @patch('apps.loans.services.loan_service.Loan.objects.filter')
    @patch('apps.risk_management.models.RiskProfile.objects.filter')
    async def test_check_eligibility_eligible(self, mock_risk_profile_filter, mock_loan_filter):
        # Mock the queryset methods
        mock_loan_count = MagicMock()
        mock_loan_count.acount.return_value = 0
        mock_loan_filter.return_value = mock_loan_count

        mock_risk_profile_queryset = MagicMock()
        mock_risk_profile_queryset.afirst.return_value = self.risk_profile
        mock_risk_profile_filter.return_value = mock_risk_profile_queryset

        # Mock member with savings account
        self.member.savings_account = MagicMock()
        self.member.savings_account.balance = Decimal('200000')

        # Check eligibility
        is_eligible, message = await LoanService.check_eligibility(self.member)

        # Assertions
        self.assertTrue(is_eligible)
        self.assertEqual(message, "Eligible for loan")

    @patch('apps.loans.services.loan_service.Loan.objects.filter')
    async def test_check_eligibility_ineligible(self, mock_loan_filter):
        # Mock an ineligible member (insufficient savings)
        self.member.savings_account = MagicMock()
        self.member.savings_account.balance = Decimal('50000')

        # Mock loan queryset
        mock_loan_count = MagicMock()
        mock_loan_count.acount.return_value = 0
        mock_loan_filter.return_value = mock_loan_count

        # Check eligibility
        is_eligible, message = await LoanService.check_eligibility(self.member)

        # Assertions
        self.assertFalse(is_eligible)
        self.assertEqual(message, "Insufficient savings balance (min. 100,000 UGX)")