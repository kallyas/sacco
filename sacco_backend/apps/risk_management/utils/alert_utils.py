# apps/risk_management/utils/alert_utils.py
def generate_alert_description(indicators: dict) -> str:
    descriptions = []

    if 'multiple_accounts' in indicators:
        descriptions.append(
            f"Multiple accounts created ({indicators['multiple_accounts']}) in short period"
        )

    if 'rapid_transactions' in indicators:
        descriptions.append(
            f"High frequency of transactions ({indicators['rapid_transactions']}) detected"
        )

    if 'large_transaction' in indicators:
        descriptions.append(
            f"Unusually large transaction amount: UGX {indicators['large_transaction']:,.2f}"
        )

    return " | ".join(descriptions)