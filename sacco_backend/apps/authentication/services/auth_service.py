from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from typing import Dict, Optional
import jwt


User = get_user_model()

class AuthenticationService:
    @staticmethod
    def generate_tokens(user: User) -> Dict[str, str]:
        """Generate access and refresh tokens for user"""
        access_token = jwt.encode(
            {
                'user_id': user.id,
                'exp': timezone.now() + timedelta(minutes=60),
                'type': 'access'
            },
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        refresh_token = jwt.encode(
            {
                'user_id': user.id,
                'exp': timezone.now() + timedelta(days=7),
                'type': 'refresh'
            },
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

    @staticmethod
    def verify_token(token: str) -> Optional[User]:
        """Verify JWT token and return user"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            return user
        except User.DoesNotExist:
            return None

    @staticmethod
    def handle_login_attempt(user: User, success: bool, ip_address: str):
        """Handle login attempt and account locking"""
        if success:
            user.failed_login_attempts = 0
            user.last_login_ip = ip_address
            user.save()
        else:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.account_locked_until = timezone.now() + timedelta(minutes=30)
            user.save()