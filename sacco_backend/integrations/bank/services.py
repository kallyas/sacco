from decimal import Decimal

import aiohttp

from apps.integrations.models import IntegrationProvider
from integrations.base import BaseIntegrationService

class BankIntegrationService(BaseIntegrationService):
    def __init__(self, provider=None):
        if provider is None:
            self.provider = IntegrationProvider.objects.get(provider_type='BANK')
        else:
            self.provider = provider
        super().__init__(self.provider)
        self.config = self.provider.config

    async def initiate_transfer(
        self,
        account_number: str,
        bank_code: str,
        amount: Decimal,
        reference: str
    ) -> dict:
        headers = self._get_auth_headers()
        payload = {
            'accountNumber': account_number,
            'bankCode': bank_code,
            'amount': str(amount),
            'reference': reference,
            'narration': f"SACCO Transfer - {reference}"
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.config['api_url']}/transfers",
                json=payload,
                headers=headers
            ) as response:
                return await response.json()