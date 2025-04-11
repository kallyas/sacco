# apps/savings/views.py
from decimal import Decimal

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.savings.models import SavingsAccount, SavingsTransaction
from apps.savings.serializers import SavingsAccountSerializer, SavingsTransactionSerializer
from apps.savings.services.transaction_service import SavingsTransactionService


class SavingsAccountViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role.name == 'STAFF':
            return SavingsAccount.objects.all()
        return SavingsAccount.objects.filter(member__user=self.request.user)

    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        account = self.get_object()
        amount = Decimal(request.data.get('amount'))

        try:
            transaction = SavingsTransactionService.process_transaction(
                account.id,
                'DEPOSIT',
                amount
            )
            return Response(SavingsTransactionSerializer(transaction).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)


class SavingsTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SavingsTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavingsTransaction.objects.filter(
            account__member__user=self.request.user
        )

