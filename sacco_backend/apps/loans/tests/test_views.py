# apps/loans/tests/test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from apps.loans.models import Loan
from decimal import Decimal

class LoanViewsTest(APITestCase):
    def setUp(self):
        # Setup test data
        pass

    def test_create_loan(self):
        url = reverse('loan-list')
        data = {
            'loan_type': 'BUSINESS',
            'amount': '1000000',
            'interest_rate': '15.00',
            'term_months': 12
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)