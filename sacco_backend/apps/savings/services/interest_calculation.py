# apps/savings/services/interest_calculation.py
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
from django.db import transaction
from ..models import SavingsAccount, InterestRate, SavingsTransaction


class InterestCalculationService:
    @staticmethod
    def calculate_daily_interest(account: SavingsAccount) -> Decimal:
        daily_rate = account.interest_rate / Decimal('36500')  # 365 days
        interest = (account.balance * daily_rate).quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        return max(interest, Decimal('0'))

    @staticmethod
    @transaction.atomic
    def apply_monthly_interest(account: SavingsAccount) -> SavingsTransaction | None:
        total_interest = Decimal('0')
        today = datetime.now().date()
        days_in_month = (today - today.replace(day=1)).days

        for _ in range(days_in_month):
            total_interest += InterestCalculationService.calculate_daily_interest(account)

        if total_interest > 0:
            _transaction = SavingsTransaction.objects.create(
                account=account,
                transaction_type='INTEREST',
                amount=total_interest,
                balance_after=account.balance + total_interest,
                reference=f"INT_{today.strftime('%Y%m')}"
            )

            account.balance += total_interest
            account.last_interest_date = today
            account.save()

            return _transaction
        return None

    @staticmethod
    def calculate_fixed_deposit_interest(
            principal: Decimal,
            term_months: int,
            rate: Decimal
    ) -> Decimal:
        annual_rate = rate / Decimal('100')
        term_years = term_months / Decimal('12')
        interest = principal * annual_rate * term_years
        return interest.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)