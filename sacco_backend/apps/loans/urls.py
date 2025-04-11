from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoanViewSet, LoanRepaymentViewSet, LoanApplicationViewSet

router = DefaultRouter()

router.register(r'loans', LoanViewSet, basename='loan-list')
router.register(r'loan_repayments',LoanRepaymentViewSet, basename='loan_repayments')
router.register(r'loan_applications', LoanApplicationViewSet, basename='loan_applications')


urlpatterns = [
    path('', include(router.urls))
]