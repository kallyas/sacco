# apps/loans/tests/test_services.py
from django.test import TestCase
from apps.loans.services.loan_service import LoanService
from apps.loans.models import Loan
from decimal import Decimal

class LoanServiceTest(TestCase):
    def test_calculate_monthly_payment(self):
        monthly_payment = LoanService.calculate_monthly_payment(
            principal=Decimal('1000000'),
            annual_rate=Decimal('15.00'),
            term_months=12
        )
        self.assertIsInstance(monthly_payment, Decimal)
        self.assertTrue(monthly_payment > 0)

    def test_loan_approval(self):
        # Test loan approval process
        pass

    def test_loan_disbursement(self):
        # Test loan disbursement process
        pass

