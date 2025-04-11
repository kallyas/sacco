import hmac
import hashlib
import base64
from datetime import datetime


class BaseIntegrationService:
    def __init__(self, provider):
        self.provider = provider

    def _get_auth_headers(self) -> dict:
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        signature = self._generate_signature(timestamp)

        return {
            'Authorization': f"Bearer {self.provider.api_key}",
            'X-Timestamp': timestamp,
            'X-Signature': signature,
            'Content-Type': 'application/json'
        }

    def _generate_signature(self, timestamp: str) -> str:
        message = f"{self.provider.api_key}{timestamp}"
        signature = hmac.new(
            self.provider.api_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
        return base64.b64encode(signature).decode()