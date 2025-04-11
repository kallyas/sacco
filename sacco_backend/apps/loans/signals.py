from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Loan, LoanRepayment
from .tasks import check_loan_status, process_loan_disbursement

@receiver(post_save, sender=Loan)
def loan_post_save(sender, instance, created, **kwargs):
    if created:
        check_loan_status.delay(instance.id)
    elif instance.status == 'APPROVED':
        process_loan_disbursement.delay(instance.id)

@receiver(post_save, sender=LoanRepayment)
def loan_repayment_post_save(sender, instance, created, **kwargs):
    if created or instance.status == 'PAID':
        instance.loan.check_completion_status()