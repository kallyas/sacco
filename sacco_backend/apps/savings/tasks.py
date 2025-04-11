# apps/savings/tasks.py
from datetime import datetime

from celery import shared_task

from apps.savings.models import SavingsAccount
from apps.savings.services.transaction_service import SavingsTransactionService


@shared_task
def calculate_monthly_interest():
    accounts = SavingsAccount.objects.filter(status='ACTIVE')
    for account in accounts:
        interest = (account.balance * account.interest_rate) / 1200
        if interest > 0:
            SavingsTransactionService.process_transaction(
                account.id,
                'INTEREST',
                interest,
                f"INT_{datetime.now().strftime('%Y%m')}"
            )
