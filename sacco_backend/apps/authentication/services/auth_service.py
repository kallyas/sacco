from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from typing import Dict, Optional
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

User = get_user_model()

class AuthenticationService:
    @staticmethod
    def generate_tokens(user: User) -> Dict[str, str]:
        """Generate access and refresh tokens for user using simplejwt"""
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return {
            'access_token': str(access_token),
            'refresh_token': str(refresh),
        }

    @staticmethod
    def verify_token(token: str) -> Optional[User]:
        """Verify JWT token and return user using simplejwt"""
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            return user
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None  # Or raise an appropriate exception

    @staticmethod
    def handle_login_attempt(user: User, success: bool, ip_address: str):
        """Handle login attempt and account locking"""
        if success:
            user.failed_login_attempts = 0
            user.last_login_ip = ip_address
            user.account_locked_until = None  # Important to reset lock
            user.save()
        else:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:  # use a setting
                user.account_locked_until = timezone.now() + timedelta(
                    minutes=settings.ACCOUNT_LOCK_MINUTES)  # use a setting

            user.save()