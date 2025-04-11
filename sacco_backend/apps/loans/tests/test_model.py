# apps/loans/tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.members.models import Member
from apps.loans.models import Loan
from decimal import Decimal

User = get_user_model()

class LoanModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            password='testpass123'
        )
        self.member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001'
        )

    def test_create_loan(self):
        loan = Loan.objects.create(
            member=self.member,
            loan_type='BUSINESS',
            amount=Decimal('1000000'),
            interest_rate=Decimal('15.00'),
            term_months=12,
            status='PENDING'
        )
        self.assertEqual(loan.status, 'PENDING')
        self.assertEqual(loan.amount, Decimal('1000000'))

