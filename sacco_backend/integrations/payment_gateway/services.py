from decimal import Decimal

from django.utils import timezone

from apps.integrations.models import IntegrationProvider, PaymentTransaction
from integrations.payment_gateway.factory import PaymentGatewayFactory


class PaymentGatewayService:
    @staticmethod
    async def initiate_payment(amount: Decimal, payment_method: str, **kwargs) -> dict:
        provider = IntegrationProvider.objects.get(
            provider_type='PAYMENT',
            name=payment_method
        )

        transaction = PaymentTransaction.objects.create(
            provider=provider,
            internal_reference=f"PG{timezone.now().strftime('%Y%m%d%H%M%S')}",
            amount=amount,
            status='INITIATED'
        )

        gateway = PaymentGatewayFactory.get_gateway(payment_method)
        result = await gateway.initiate_payment(transaction, **kwargs)

        transaction.provider_reference = result.get('provider_reference')
        transaction.status = 'PENDING'
        transaction.save()

        return result