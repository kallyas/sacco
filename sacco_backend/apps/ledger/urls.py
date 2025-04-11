from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LedgerEntryViewSet

router = DefaultRouter()

router.register(r'ledgers',LedgerEntryViewSet,basename='ledgers')

urlpatterns = [
    path('',include(router.urls))
]