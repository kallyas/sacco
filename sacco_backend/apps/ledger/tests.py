from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date

from apps.authentication.models import Role
from apps.members.models import Member
from apps.transactions.models import Transaction
from apps.ledger.models import LedgerEntry
from shared.services.ledger_service import LedgerService

User = get_user_model()


class LedgerEntryModelTest(TestCase):
    def setUp(self):
        # Create role
        self.role = Role.objects.create(name='ACCOUNTANT')

        # Create user
        self.user = User.objects.create_user(
            email='accountant@example.com',
            password='testpass123',
            first_name='Test',
            last_name='Accountant',
            role=self.role,
            phone_number='+256700000000',
            national_id='ACCT123'
        )

        # Create member
        self.member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            date_of_birth=date(1990, 1, 1),
            marital_status='SINGLE',
            employment_status='EMPLOYED',
            occupation='Accountant',
            monthly_income=Decimal('800000'),
            physical_address='Test Address',
            city='Kampala',
            district='Central',
            national_id='ACCT123',
            membership_number='SACCOM2024TEST001',
            membership_type='INDIVIDUAL'
        )

        # Create transaction
        self.transaction = Transaction.objects.create(
            transaction_ref='TXN20240101001',
            member=self.member,
            transaction_type='DEPOSIT',
            amount=Decimal('100000'),
            payment_method='CASH',
            status='COMPLETED'
        )

        # Create ledger entries
        self.debit_entry = LedgerEntry.objects.create(
            transaction=self.transaction,
            account_code='1000',  # CASH
            entry_type='DEBIT',
            amount=Decimal('100000'),
            balance_after=Decimal('100000'),
            description='Cash deposit'
        )

        self.credit_entry = LedgerEntry.objects.create(
            transaction=self.transaction,
            account_code='2000',  # SAVINGS
            entry_type='CREDIT',
            amount=Decimal('100000'),
            balance_after=Decimal('100000'),
            description='Savings deposit'
        )

    def test_ledger_entry_creation(self):
        self.assertEqual(self.debit_entry.transaction, self.transaction)
        self.assertEqual(self.debit_entry.account_code, '1000')
        self.assertEqual(self.debit_entry.entry_type, 'DEBIT')
        self.assertEqual(self.debit_entry.amount, Decimal('100000'))

        self.assertEqual(self.credit_entry.transaction, self.transaction)
        self.assertEqual(self.credit_entry.account_code, '2000')
        self.assertEqual(self.credit_entry.entry_type, 'CREDIT')
        self.assertEqual(self.credit_entry.amount, Decimal('100000'))

    def test_ledger_entry_str_method(self):
        expected_str = f"{self.transaction.transaction_ref} - DEBIT"
        self.assertEqual(str(self.debit_entry), expected_str)

    def test_get_account_balance(self):
        # Test the get_account_balance method of LedgerService
        balance = LedgerService.get_account_balance('1000')  # CASH account
        self.assertEqual(balance, Decimal('100000'))

        balance = LedgerService.get_account_balance('2000')  # SAVINGS account
        self.assertEqual(balance, Decimal('-100000'))  # Credit entries decrease balance

    def test_create_deposit_entries(self):
        # Create a new transaction
        transaction = Transaction.objects.create(
            transaction_ref='TXN20240101002',
            member=self.member,
            transaction_type='DEPOSIT',
            amount=Decimal('50000'),
            payment_method='CASH',
            status='COMPLETED'
        )

        # Use LedgerService to create entries
        LedgerService.create_deposit_entries(transaction, Decimal('1000'))

        # Check that entries were created correctly
        entries = LedgerEntry.objects.filter(transaction=transaction)
        self.assertEqual(entries.count(), 3)  # 2 for deposit, 1 for fee

        # Verify CASH debit entry
        cash_entry = entries.get(account_code=LedgerService.ACCOUNT_CODES['CASH'])
        self.assertEqual(cash_entry.entry_type, 'DEBIT')
        self.assertEqual(cash_entry.amount, Decimal('50000'))

        # Verify SAVINGS credit entry
        savings_entry = entries.get(account_code=LedgerService.ACCOUNT_CODES['SAVINGS'])
        self.assertEqual(savings_entry.entry_type, 'CREDIT')
        self.assertEqual(savings_entry.amount, Decimal('49000'))  # 50000 - 1000 fee

        # Verify FEE credit entry
        fee_entry = entries.get(account_code=LedgerService.ACCOUNT_CODES['FEES_INCOME'])
        self.assertEqual(fee_entry.entry_type, 'CREDIT')
        self.assertEqual(fee_entry.amount, Decimal('1000'))