# apps/loans/tests/test_views.py
from decimal import Decimal

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.authentication.models import Role
from apps.members.models import Member
from apps.loans.models import Loan

User = get_user_model()


class LoanViewsTest(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role=Role.objects.create(name='Member', description='Member role')
        )

        # Create a member associated with the user
        self.member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            date_of_birth='1990-01-01',
            monthly_income=Decimal('1150000'),
        )

        # Authenticate the client
        self.client.force_authenticate(user=self.user)

        # Create an existing loan for testing
        self.loan = Loan.objects.create(
            reference='LN2024TEST001',
            member=self.member,
            loan_type='PERSONAL',
            amount=500000,
            interest_rate=12.00,
            term_months=6,
            status='PENDING',
            total_amount_payable=550000,
            total_interest=50000,
            outstanding_balance=550000
        )

    def test_create_loan(self):
        url = reverse('loan-list')
        data = {
            'member': self.member.id,
            'reference': 'LN2024TEST002',
            'loan_type': 'BUSINESS',
            'amount': '1000000',
            'interest_rate': '15.00',
            'term_months': 12,
            'status': 'PENDING',
            'total_amount_payable': '1150000',
            'total_interest': '150000',
            'outstanding_balance': '1150000'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Loan.objects.count(), 2)
        self.assertEqual(Loan.objects.get(reference='LN2024TEST002').loan_type, 'BUSINESS')

    def test_get_loan_list(self):
        url = reverse('loan-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_get_loan_detail(self):
        url = reverse('loan-detail', args=[self.loan.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['reference'], 'LN2024TEST001')