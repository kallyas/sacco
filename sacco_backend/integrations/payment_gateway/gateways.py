from apps.integrations.models import PaymentTransaction


class BaseGateway:
    async def initiate_payment(self, transaction: PaymentTransaction, **kwargs) -> dict:
        raise NotImplementedError


class MTNMobileMoneyGateway(BaseGateway):
    async def initiate_payment(self, transaction: PaymentTransaction, **kwargs) -> dict:
        phone_number = kwargs.get('phone_number')
        if not phone_number:
            raise ValueError("Phone number is required for MTN Mobile Money")

        payload = {
            'amount': str(transaction.amount),
            'currency': transaction.currency,
            'phone_number': phone_number,
            'external_reference': transaction.internal_reference
        }

        # API call implementation
        return {'provider_reference': 'MTN123456', 'status': 'PENDING'}


class AirtelMoneyGateway(BaseGateway):
    async def initiate_payment(self, transaction: PaymentTransaction, **kwargs) -> dict:
        phone_number = kwargs.get('phone_number')
        if not phone_number:
            raise ValueError("Phone number is required for Airtel Money")

        payload = {
            'amount': str(transaction.amount),
            'msisdn': phone_number,
            'reference': transaction.internal_reference
        }

        # API call implementation
        return {'provider_reference': 'AIR123456', 'status': 'PENDING'}


class BankGateway(BaseGateway):
    async def initiate_payment(self, transaction: PaymentTransaction, **kwargs) -> dict:
        account_number = kwargs.get('account_number')
        bank_code = kwargs.get('bank_code')

        if not account_number or not bank_code:
            raise ValueError("Account number and bank code are required for bank transfers")

        payload = {
            'amount': str(transaction.amount),
            'account_number': account_number,
            'bank_code': bank_code,
            'reference': transaction.internal_reference
        }

        # API call implementation
        return {'provider_reference': 'BANK123456', 'status': 'PENDING'}