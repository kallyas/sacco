import logging

import aiohttp

from apps.integrations.models import IntegrationProvider

logger = logging.getLogger(__name__)


class SMSService:
    @staticmethod
    async def send_message(phone_number: str, message: str) -> dict:
        """Send SMS using configured provider"""
        provider = await IntegrationProvider.objects.aget(
            provider_type='SMS',
            is_active=True
        )

        headers = {
            'Authorization': f'Bearer {provider.api_key}',
            'Content-Type': 'application/json'
        }

        payload = {
            'to': phone_number,
            'message': message,
            'sender_id': provider.config.get('sender_id', 'SACCO')
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(
                        f"{provider.config['api_url']}/messages",
                        json=payload,
                        headers=headers
                ) as response:
                    return await response.json()
            except Exception as e:
                logger.error(f"SMS sending failed: {str(e)}")
                raise

    @staticmethod
    async def send_bulk_messages(phone_numbers: list, message: str) -> list:
        """Send bulk SMS messages"""
        results = []
        for phone in phone_numbers:
            try:
                result = await SMSService.send_message(phone, message)
                results.append({'phone': phone, 'status': 'success', 'result': result})
            except Exception as e:
                results.append({'phone': phone, 'status': 'failed', 'error': str(e)})
        return results
