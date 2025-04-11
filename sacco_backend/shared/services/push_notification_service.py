import firebase_admin
from firebase_admin import messaging
from typing import Union, List, Dict
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


class PushNotificationService:
    @staticmethod
    def initialize_firebase():
        """Initialize Firebase Admin SDK if not already initialized"""
        try:
            firebase_admin.get_app()
        except ValueError:
            cred_path = settings.FIREBASE_CREDENTIALS_PATH
            cred = firebase_admin.credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)

    @staticmethod
    async def send_notification(
            device_token: Union[str, List[str]],
            notification_data: dict
    ) -> Dict[str, any]:
        """Send push notification using Firebase"""
        try:
            PushNotificationService.initialize_firebase()

            message = messaging.MulticastMessage(
                tokens=[device_token] if isinstance(device_token, str) else device_token,
                notification=messaging.Notification(
                    title=notification_data.get('title'),
                    body=notification_data.get('message')
                ),
                data=notification_data.get('data', {}),
                android=messaging.AndroidConfig(
                    priority='high',
                    notification=messaging.AndroidNotification(
                        icon='notification_icon',
                        color='#4CAF50',
                        sound='default'
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            badge=1,
                            sound='default',
                            content_available=True
                        )
                    )
                )
            )

            response = await messaging.send_multicast(message)

            return {
                'success_count': response.success_count,
                'failure_count': response.failure_count,
                'responses': response.responses
            }

        except Exception as e:
            logger.error(f"Push notification failed: {str(e)}")
            raise

    @staticmethod
    async def send_topic_notification(
            topic: str,
            notification_data: dict
    ) -> Dict[str, any]:
        """Send notification to a topic"""
        try:
            PushNotificationService.initialize_firebase()

            message = messaging.Message(
                topic=topic,
                notification=messaging.Notification(
                    title=notification_data.get('title'),
                    body=notification_data.get('message')
                ),
                data=notification_data.get('data', {}),
                android=messaging.AndroidConfig(
                    priority='high',
                    notification=messaging.AndroidNotification(
                        icon='notification_icon',
                        color='#4CAF50'
                    )
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            badge=1,
                            sound='default',
                            content_available=True
                        )
                    )
                )
            )

            response = await messaging.send(message)
            return {'message_id': response}

        except Exception as e:
            logger.error(f"Topic notification failed: {str(e)}")
            raise