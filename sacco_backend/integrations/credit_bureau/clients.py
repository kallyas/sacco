import aiohttp

from apps.integrations.models import IntegrationProvider


class CreditBureauClient:
    def __init__(self, provider: IntegrationProvider):
        self.base_url = provider.config['api_url']
        self.username = provider.config['username']
        self.password = provider.config['password']
        self._session = None
        self._token = None

    async def _get_session(self):
        if not self._session:
            self._session = aiohttp.ClientSession(base_url=self.base_url)
        if not self._token:
            await self._authenticate()
        return self._session

    async def _authenticate(self):
        async with self._session.post('/auth', json={
            'username': self.username,
            'password': self.password
        }) as response:
            data = await response.json()
            self._token = data['token']
            self._session.headers.update({
                'Authorization': f'Bearer {self._token}'
            })

    async def get_credit_report(self, national_id: str):
        session = await self._get_session()
        async with session.get(f'/credit-reports/{national_id}') as response:
            return await response.json()