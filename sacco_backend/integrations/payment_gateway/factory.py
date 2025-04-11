from integrations.payment_gateway.gateways import MTNMobileMoneyGateway, AirtelMoneyGateway, BankGateway


class PaymentGatewayFactory:
    GATEWAYS = {
        'MTN': MTNMobileMoneyGateway,
        'AIRTEL': AirtelMoneyGateway,
        'BANK': BankGateway
    }

    @staticmethod
    def get_gateway(payment_method: str):
        gateway_class = PaymentGatewayFactory.GATEWAYS.get(payment_method)
        if not gateway_class:
            raise ValueError(f"Unsupported payment method: {payment_method}")
        return gateway_class()
