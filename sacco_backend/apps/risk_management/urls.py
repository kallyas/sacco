from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RiskProfileViewSet, FraudAlertViewSet

router = DefaultRouter()

router.register(r'risk_profiles', RiskProfileViewSet, basename='risk_profiles')
router.register(r'fraud_alerts', FraudAlertViewSet, basename='fraud_alerts')

urlpatterns = [
    path('', include(router.urls))
]
