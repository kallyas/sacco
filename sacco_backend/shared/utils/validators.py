import re
from datetime import date, time

from django.core.exceptions import ValidationError

def validate_phone_number(value: str):
    pattern = r'^\+256[0-9]{9}$'
    if not re.match(pattern, value):
        raise ValidationError('Invalid Uganda phone number format. Use format: +256XXXXXXXXX')

def validate_national_id(value: str):
    pattern = r'^CM[0-9]{13}$'
    if not re.match(pattern, value):
        raise ValidationError('Invalid Uganda National ID format. Use format: CMXXXXXXXXXXXXX')

def validate_future_date(value: date):
    if value <= date.today():
        raise ValidationError('Date must be in the future')

def validate_business_hours(value: time):
    if not (time(9, 0) <= value <= time(17, 0)):
        raise ValidationError('Time must be during business hours (9 AM - 5 PM)')