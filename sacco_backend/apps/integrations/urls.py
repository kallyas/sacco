from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.integrations.views import USSDView

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
]+ [
    path('ussd/', USSDView.as_view(), name='ussd'),
]
