from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoanViewSet, LoanRepaymentViewSet, LoanApplicationViewSet

router = DefaultRouter()

router.register(r'loans', LoanViewSet)
router.register(r'loan_repayments',LoanRepaymentViewSet)
router.register(r'loan_applications', LoanApplicationViewSet)


urlpatterns = [
    path('', include(router.urls))
]