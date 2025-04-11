import aiohttp

from apps.integrations.models import IntegrationProvider
from apps.loans.models import Loan
from integrations.base import BaseIntegrationService

class CreditBureauService(BaseIntegrationService):
    def __init__(self, provider=None):
        if provider is None:
            # If no provider is passed, fetch the CREDIT_BUREAU provider from the database
            self.provider = IntegrationProvider.objects.get(provider_type='CREDIT_BUREAU')
        else:
            self.provider = provider

        super().__init__(self.provider)
        self.config = self.provider.config

    def _get_payment_history(self, loan: 'Loan') -> list:
        history = []
        for repayment in loan.repayments.all().order_by('due_date'):
            history.append({
                'due_date': repayment.due_date.isoformat(),
                'amount': str(repayment.amount),
                'status': repayment.status,
                'payment_date': repayment.payment_date.isoformat() if repayment.payment_date else None,
                'days_late': (repayment.payment_date - repayment.due_date).days if repayment.payment_date else None
            })
        return history

    async def check_credit_score(self, national_id: str) -> dict:
        headers = self._get_auth_headers()

        async with aiohttp.ClientSession() as session:
            async with session.get(
                    f"{self.config['api_url']}/credit-score/{national_id}",
                    headers=headers
            ) as response:
                return await response.json()

    async def report_loan_status(self, loan: 'Loan') -> dict:
        headers = self._get_auth_headers()
        payload = {
            'national_id': loan.member.national_id,
            'loan_amount': str(loan.amount),
            'status': loan.status,
            'payment_history': self._get_payment_history(loan)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.config['api_url']}/report-loan",
                    json=payload,
                    headers=headers
            ) as response:
                return await response.json()