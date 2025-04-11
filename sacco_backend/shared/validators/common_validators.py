# shared/validators/common_validators.py
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from datetime import date, datetime
import re

class CommonValidators:
    @staticmethod
    def validate_phone(value):
        pattern = r'^\+256[0-9]{9}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid Uganda phone number format (+256XXXXXXXXX)')

    @staticmethod
    def validate_email(value):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid email format')

    @staticmethod
    def validate_amount(value):
        if value <= 0:
            raise ValidationError('Amount must be greater than zero')

    @staticmethod
    def validate_percentage(value):
        if not 0 <= value <= 100:
            raise ValidationError('Percentage must be between 0 and 100')

    @staticmethod
    def validate_future_date(value):
        if value <= date.today():
            raise ValidationError('Date must be in the future')

    @staticmethod
    def validate_past_date(value):
        if value > date.today():
            raise ValidationError('Date must be in the past')

