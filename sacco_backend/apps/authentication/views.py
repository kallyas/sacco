from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Role, Permission
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    RoleSerializer, PermissionSerializer
)
from .services.auth_service import AuthenticationService
from .permissions import HasRolePermission
from django.utils import timezone

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = AuthenticationService.generate_tokens(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Please provide both email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if user.account_locked_until and user.account_locked_until > timezone.now():
            return Response(
                {'error': 'Account is temporarily locked'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.check_password(password):
            AuthenticationService.handle_login_attempt(
                user, False, request.META.get('REMOTE_ADDR')
            )
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        AuthenticationService.handle_login_attempt(
            user, True, request.META.get('REMOTE_ADDR')
        )
        tokens = AuthenticationService.generate_tokens(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        })

    @action(detail=False, methods=['post'])
    def refresh_token(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = AuthenticationService.verify_token(refresh_token)
        if not user:
            return Response(
                {'error': 'Invalid refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = AuthenticationService.generate_tokens(user)
        return Response({'tokens': tokens})

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        return Response(UserSerializer(user).data)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated, HasRolePermission]
    required_role = 'ADMIN'


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated, HasRolePermission]
    required_role = 'ADMIN'