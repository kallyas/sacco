from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.ledger.models import LedgerEntry
from apps.ledger.serializers import LedgerEntrySerializer
from shared.services.ledger_service import LedgerService


class LedgerEntryViewSet(viewsets.ModelViewSet):
    serializer_class = LedgerEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.role.name in ['ACCOUNTANT', 'ADMIN']:
            return LedgerEntry.objects.none()

        queryset = LedgerEntry.objects.all()

        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(created_at__range=[start_date, end_date])

        # Filter by account code
        account_code = self.request.query_params.get('account_code')
        if account_code:
            queryset = queryset.filter(account_code=account_code)

        return queryset

    @action(detail=False, methods=['get'])
    def account_balance(self, request):
        account_code = request.query_params.get('account_code')
        if not account_code:
            return Response({'error': 'Account code is required'}, status=400)

        balance = LedgerService.get_account_balance(account_code)
        return Response({'balance': balance})

    @action(detail=False, methods=['get'])
    def trial_balance(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        trial_balance = LedgerService.generate_trial_balance(start_date, end_date)
        return Response(trial_balance)
