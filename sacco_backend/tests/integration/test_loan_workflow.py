from django.test import TestCase
from apps.loans.models import Loan
from apps.members.models import Member
from decimal import Decimal


class LoanWorkflowTest(TestCase):
    def setUp(self):
        self.member = Member.objects.create(
            # Member setup data
        )

    def test_complete_loan_workflow(self):
        # Create loan application
        loan = Loan.objects.create(
            member=self.member,
            amount=Decimal('1000000'),
            term_months=12,
            interest_rate=Decimal('15.00'),
            status='PENDING'
        )

        # Test loan approval
        loan.status = 'APPROVED'
        loan.save()
        self.assertEqual(loan.status, 'APPROVED')

        # Test loan disbursement
        loan.status = 'DISBURSED'
        loan.save()
        self.assertEqual(loan.status, 'DISBURSED')
