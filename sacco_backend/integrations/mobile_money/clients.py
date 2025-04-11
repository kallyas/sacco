from decimal import Decimal

import aiohttp

from apps.integrations.models import IntegrationProvider


class MobileMoneyClient:
    def __init__(self, provider: IntegrationProvider):
        self.base_url = provider.config['api_url']
        self.api_key = provider.api_key
        self._session = None

    async def _get_session(self):
        if not self._session:
            self._session = aiohttp.ClientSession(
                base_url=self.base_url,
                headers={'Authorization': f'Bearer {self.api_key}'}
            )
        return self._session

    async def collection_request(self, phone: str, amount: Decimal, reference: str):
        session = await self._get_session()
        async with session.post('/collections', json={
            'msisdn': phone,
            'amount': str(amount),
            'reference': reference
        }) as response:
            return await response.json()

    async def check_status(self, reference: str):
        session = await self._get_session()
        async with session.get(f'/collections/{reference}/status') as response:
            return await response.json()
