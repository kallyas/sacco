# apps/loans/services/repayment_service.py
from django.db import transaction
from datetime import date
from decimal import Decimal
from ..models import LoanRepayment, Loan
from apps.transactions.models import Transaction


class RepaymentService:
    @staticmethod
    @transaction.atomic
    def process_repayment(loan_id: int, amount: Decimal, payment_reference: str) -> list[LoanRepayment]:
        loan = Loan.objects.select_for_update().get(id=loan_id)
        due_repayments = loan.repayments.filter(
            status__in=['PENDING', 'OVERDUE']
        ).order_by('due_date')

        remaining_amount = amount
        processed_repayments = []

        for repayment in due_repayments:
            if remaining_amount <= 0:
                break

            if remaining_amount >= repayment.amount:
                payment_amount = repayment.amount
            else:
                payment_amount = remaining_amount

            repayment.status = 'PAID' if payment_amount >= repayment.amount else 'PENDING'
            repayment.payment_date = date.today()
            repayment.payment_reference = payment_reference
            repayment.save()

            remaining_amount -= payment_amount
            processed_repayments.append(repayment)

        Transaction.objects.create(
            member=loan.member,
            transaction_type='LOAN_REPAYMENT',
            amount=amount,
            reference=payment_reference
        )

        RepaymentService._update_loan_status(loan)
        return processed_repayments

    @staticmethod
    def _update_loan_status(loan: Loan):
        unpaid_repayments = loan.repayments.exclude(status='PAID').count()
        if unpaid_repayments == 0:
            loan.status = 'COMPLETED'
            loan.save()