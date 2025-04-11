# apps/reporting/tasks.py
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from apps.reporting.models import ReportSchedule, Report
from apps.reporting.services.report_exporter import ReportExporter
from apps.reporting.services.report_generator import ReportGenerator


@shared_task
def generate_scheduled_reports():
    today = timezone.now()
    schedules = ReportSchedule.objects.filter(
        is_active=True,
        next_run__lte=today
    )

    for schedule in schedules:
        try:
            # Generate report based on type
            if schedule.report_type == 'FINANCIAL':
                data = ReportGenerator.generate_financial_report(
                    today - timedelta(days=30),
                    today
                )

                # Export report
                filename = f"financial_report_{today.strftime('%Y%m%d')}.xlsx"
                file_path = ReportExporter.export_to_excel(data, filename)

                # Create report record
                Report.objects.create(
                    report_type=schedule.report_type,
                    name=filename,
                    file=file_path,
                    format='XLSX',
                    status='COMPLETED',
                    start_date=today - timedelta(days=30),
                    end_date=today
                )

            # Update schedule
            schedule.last_run = today
            schedule.next_run = calculate_next_run(schedule.frequency)
            schedule.save()

        except Exception as e:
            Report.objects.create(
                report_type=schedule.report_type,
                name=f"failed_{today.strftime('%Y%m%d')}",
                status='FAILED',
                error_message=str(e)
            )