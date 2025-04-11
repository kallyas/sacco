from decimal import Decimal

import aiohttp
from django.utils import timezone

from apps.integrations.models import IntegrationProvider
from integrations.base import BaseIntegrationService


class MobileMoneyService(BaseIntegrationService):
    def __init__(self, provider = None):
        if provider is None:
            self.provider = IntegrationProvider.objects.get(
                provider_type='PAYMENT',
                name=provider
            )
        else:
            self.provider = provider
        super().__init__(self.provider)
        self.config = self.provider.config

    async def initiate_collection(self, phone_number: str, amount: Decimal) -> dict:
        headers = self._get_auth_headers()
        payload = {
            'phoneNumber': phone_number,
            'amount': str(amount),
            'currency': 'UGX',
            'externalRef': f"MM{timezone.now().strftime('%Y%m%d%H%M%S')}"
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.config['api_url']}/collections",
                json=payload,
                headers=headers
            ) as response:
                return await response.json()