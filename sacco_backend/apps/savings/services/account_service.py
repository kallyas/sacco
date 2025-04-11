# apps/savings/services/account_service.py
from datetime import datetime
from decimal import Decimal

from django.db import transaction

from apps.members.models import Member
from apps.savings.models import SavingsAccount, InterestRate, SavingsTransaction


class SavingsAccountService:
    @staticmethod
    @transaction.atomic
    def open_account(member_id: int, account_type: str, initial_deposit: Decimal) -> SavingsAccount:
        member = Member.objects.get(id=member_id)
        account_number = SavingsAccountService._generate_account_number(member)

        account = SavingsAccount.objects.create(
            member=member,
            account_number=account_number,
            account_type=account_type,
            balance=initial_deposit,
            interest_rate=InterestRate.objects.get(account_type=account_type).rate
        )

        if initial_deposit > 0:
            SavingsTransaction.objects.create(
                account=account,
                transaction_type='DEPOSIT',
                amount=initial_deposit,
                balance_after=initial_deposit,
                reference=f"INIT_{account_number}"
            )

        return account

    @staticmethod
    def _generate_account_number(member: Member) -> str:
        prefix = f"SAV{datetime.now().year}"
        count = SavingsAccount.objects.filter(
            account_number__startswith=prefix
        ).count()
        return f"{prefix}{str(count + 1).zfill(6)}"


