# apps/loans/tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.authentication.models import Role
from apps.members.models import Member
from apps.loans.models import Loan, LoanApplication, LoanRepayment
from decimal import Decimal
from datetime import date

User = get_user_model()


class LoanModelTest(TestCase):
    def setUp(self):
        # Create a role
        self.role = Role.objects.create(name='Member', description='Member role')

        # Create a user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role=self.role,
            phone_number='+256700000000',
            national_id='TEST123'
        )

        # Create a member
        self.member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            date_of_birth=date(1990, 1, 1),
            membership_number='SACCOM2024TEST001',
            marital_status='SINGLE',
            employment_status='EMPLOYED',
            occupation='Developer',
            monthly_income=Decimal('500000'),
            physical_address='Test Address',
            city='Kampala',
            district='Central',
            national_id='TEST123',
            membership_type='INDIVIDUAL'
        )

    def test_create_loan(self):
        loan = Loan.objects.create(
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
        self.assertEqual(loan.status, 'PENDING')
        self.assertEqual(loan.amount, Decimal('1000000'))
        self.assertEqual(loan.reference, 'LN2024TEST001')
        self.assertEqual(str(loan), 'BUSINESS - 1000000')

    def test_create_loan_application(self):
        application = LoanApplication.objects.create(
            member=self.member,
            loan_type='BUSINESS',
            amount_requested=Decimal('1000000'),
            purpose='Business expansion',
            employment_details='Self-employed, 5 years',
            monthly_income=Decimal('500000'),
            credit_score=650,
            status='PENDING'
        )

        self.assertEqual(application.status, 'PENDING')
        self.assertEqual(application.amount_requested, Decimal('1000000'))
        self.assertEqual(str(application), 'BUSINESS - 1000000')

    def test_create_loan_repayment(self):
        # First create a loan
        loan = Loan.objects.create(
            reference='LN2024TEST001',
            member=self.member,
            loan_type='BUSINESS',
            amount=Decimal('1000000'),
            interest_rate=Decimal('15.00'),
            term_months=12,
            status='DISBURSED',
            total_amount_payable=Decimal('1150000'),
            total_interest=Decimal('150000'),
            outstanding_balance=Decimal('1150000')
        )

        # Create a repayment
        repayment = LoanRepayment.objects.create(
            loan=loan,
            reference='RP2024TEST001',
            due_date=date(2024, 5, 1),
            amount=Decimal('100000'),
            principal_component=Decimal('80000'),
            interest_component=Decimal('20000'),
            penalty_amount=Decimal('0'),
            status='PENDING'
        )

        self.assertEqual(repayment.status, 'PENDING')
        self.assertEqual(repayment.amount, Decimal('100000'))
        self.assertEqual(str(repayment), 'LN2024TEST001 - 100000')

    def test_loan_status_choices(self):
        # Test that the loan status choices are correctly defined
        valid_statuses = [status[0] for status in Loan.LOAN_STATUS_CHOICES]

        self.assertIn('PENDING', valid_statuses)
        self.assertIn('APPROVED', valid_statuses)
        self.assertIn('REJECTED', valid_statuses)
        self.assertIn('DISBURSED', valid_statuses)
        self.assertIn('COMPLETED', valid_statuses)
        self.assertIn('DEFAULTED', valid_statuses)