from datetime import datetime
from typing import Dict, Any

from django.db.models import Sum

from apps.loans.models import Loan
from apps.savings.models import SavingsAccount
from apps.transactions.models import Transaction


class ReportGenerator:
    @staticmethod
    def generate_financial_report(start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        # Query data
        transactions = Transaction.objects.filter(
            created_at__range=[start_date, end_date]
        )
        loans = Loan.objects.filter(
            created_at__range=[start_date, end_date]
        )
        savings = SavingsAccount.objects.filter(
            created_at__range=[start_date, end_date]
        )

        # Calculate metrics
        total_deposits = transactions.filter(
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_withdrawals = transactions.filter(
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or 0

        loan_disbursements = loans.filter(
            status='DISBURSED'
        ).aggregate(total=Sum('amount'))['total'] or 0

        loan_repayments = transactions.filter(
            transaction_type='LOAN_REPAYMENT'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Create report data
        report_data = {
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'summary': {
                'total_deposits': total_deposits,
                'total_withdrawals': total_withdrawals,
                'net_position': total_deposits - total_withdrawals,
                'total_loans_disbursed': loan_disbursements,
                'total_loan_repayments': loan_repayments
            },
            'loans': {
                'disbursed_count': loans.filter(status='DISBURSED').count(),
                'pending_count': loans.filter(status='PENDING').count(),
                'defaulted_count': loans.filter(status='DEFAULTED').count()
            },
            'savings': {
                'total_accounts': savings.count(),
                'total_balance': savings.aggregate(total=Sum('balance'))['total'] or 0
            }
        }

        return report_data