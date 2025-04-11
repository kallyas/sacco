import base64

import aiohttp

from apps.integrations.models import IntegrationProvider


class BankClient:
    def __init__(self, provider: IntegrationProvider):
        self.base_url = provider.config['api_url']
        self.client_id = provider.config['client_id']
        self.client_secret = provider.config['client_secret']
        self._session = None
        self._token = None

    async def _get_session(self):
        if not self._session:
            self._session = aiohttp.ClientSession(base_url=self.base_url)
        if not self._token:
            await self._authenticate()
        return self._session

    async def _authenticate(self):
        auth = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        async with self._session.post('/oauth/token', headers={
            'Authorization': f'Basic {auth}'
        }) as response:
            data = await response.json()
            self._token = data['access_token']
            self._session.headers.update({
                'Authorization': f'Bearer {self._token}'
            })

    async def account_inquiry(self, account_number: str):
        session = await self._get_session()
        async with session.get(f'/accounts/{account_number}') as response:
            return await response.json()

    async def initiate_transfer(self, data: dict):
        session = await self._get_session()
        async with session.post('/transfers', json=data) as response:
            return await response.json()