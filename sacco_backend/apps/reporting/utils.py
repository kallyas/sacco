from datetime import datetime, timedelta

from dateutil.relativedelta import relativedelta
from django.utils import timezone


def calculate_next_run(frequency: str) -> datetime:
    now = timezone.now()

    if frequency == 'DAILY':
        next_run = now + timedelta(days=1)
    elif frequency == 'WEEKLY':
        next_run = now + timedelta(weeks=1)
    elif frequency == 'MONTHLY':
        if now.month == 12:
            next_run = now.replace(year=now.year + 1, month=1)
        else:
            next_run = now.replace(month=now.month + 1)
    elif frequency == 'QUARTERLY':
        months_to_add = 3 - ((now.month - 1) % 3)
        next_run = now + relativedelta(months=months_to_add)
    else:
        raise ValueError(f"Invalid frequency: {frequency}")

    return next_run.replace(hour=0, minute=0, second=0, microsecond=0)