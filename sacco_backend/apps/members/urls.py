from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, NextOfKinViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'next-of-kin', NextOfKinViewSet)

urlpatterns = [
    path('', include(router.urls)),
]