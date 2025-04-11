# apps/reporting/views.py
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.reporting.models import Report
from apps.reporting.serializers import ReportSerializer
from apps.reporting.services.report_exporter import ReportExporter
from apps.reporting.services.report_generator import ReportGenerator


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(created_by=self.request.user)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        report_type = request.data.get('report_type')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        try:
            if report_type == 'FINANCIAL':
                data = ReportGenerator.generate_financial_report(
                    start_date,
                    end_date
                )

                filename = f"financial_report_{timezone.now().strftime('%Y%m%d')}.xlsx"
                file_path = ReportExporter.export_to_excel(data, filename)

                report = Report.objects.create(
                    report_type=report_type,
                    name=filename,
                    file=file_path,
                    format='XLSX',
                    status='COMPLETED',
                    start_date=start_date,
                    end_date=end_date,
                    created_by=request.user
                )

                return Response(ReportSerializer(report).data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )