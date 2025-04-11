# apps/transactions/services/fees_calculator.py
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict

from ..models import TransactionFee


class FeesCalculator:
    @staticmethod
    def calculate_transaction_fee(
            transaction_type: str,
            payment_method: str,
            amount: Decimal,
            member_type: str = 'REGULAR'
    ) -> Dict[str, Decimal]:
        fee_structure = TransactionFee.objects.get(
            transaction_type=transaction_type,
            payment_method=payment_method
        )

        base_fee = fee_structure.fixed_amount
        percentage_fee = (amount * fee_structure.percentage / 100).quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )

        total_fee = base_fee + percentage_fee

        # Apply member type discounts
        if member_type == 'PREMIUM':
            total_fee = total_fee * Decimal('0.5')
        elif member_type == 'GOLD':
            total_fee = total_fee * Decimal('0.25')

        # Apply limits
        if fee_structure.max_amount:
            total_fee = min(total_fee, fee_structure.max_amount)
        total_fee = max(total_fee, fee_structure.min_amount)

        return {
            'base_fee': base_fee,
            'percentage_fee': percentage_fee,
            'total_fee': total_fee
        }

    @staticmethod
    def calculate_withdrawal_fee(
            amount: Decimal,
            payment_method: str,
            member_type: str = 'REGULAR'
    ) -> Decimal:
        fee_details = FeesCalculator.calculate_transaction_fee(
            'WITHDRAWAL',
            payment_method,
            amount,
            member_type
        )
        return fee_details['total_fee']

    @staticmethod
    def calculate_deposit_fee(
            amount: Decimal,
            payment_method: str,
            member_type: str = 'REGULAR'
    ) -> Decimal:
        fee_details = FeesCalculator.calculate_transaction_fee(
            'DEPOSIT',
            payment_method,
            amount,
            member_type
        )
        return fee_details['total_fee']