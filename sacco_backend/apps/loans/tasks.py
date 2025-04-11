from celery import shared_task
from django.utils import timezone
from .models import Loan
from .services.loan_service import LoanService

@shared_task
def check_loan_status(loan_id):
    loan = Loan.objects.get(id=loan_id)
    if loan.status == 'DISBURSED':
        repayments = loan.repayments.filter(due_date__lt=timezone.now(), status='UNPAID')
        if repayments.exists():
            loan.status = 'DEFAULTED'
            loan.save()

@shared_task
def process_loan_disbursement(loan_id):
    loan = Loan.objects.get(id=loan_id)
    LoanService.disburse_loan(loan)

@shared_task
def generate_loan_reports():
    # Implementation for generating periodic loan reports
    pass