from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, RoleViewSet, PermissionViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]