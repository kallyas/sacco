from decimal import Decimal, ROUND_HALF_UP

def round_currency(amount: Decimal) -> Decimal:
    return Decimal(amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def format_currency(amount: Decimal, currency: str = 'UGX') -> str:
    return f"{currency} {amount:,.2f}"