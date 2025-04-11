from datetime import timedelta, date


def calculate_age(date_of_birth: date) -> int:
    today = date.today()
    return today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))

def get_next_working_day(from_date: date) -> date:
    next_day = from_date + timedelta(days=1)
    while next_day.weekday() in (5, 6):  # Skip weekends
        next_day += timedelta(days=1)
    return next_day

def ago(days: int) -> date:
    return date.today() - timedelta(days=days)

def from_now(days: int) -> date:
    return date.today() + timedelta(days=days)

def days_between(start_date: date, end_date: date) -> int:
    return (end_date - start_date).days

def is_weekend(date_to_check: date) -> bool:
    return date_to_check.weekday() in (5, 6)

def is_weekday(date_to_check: date) -> bool:
    return not is_weekend(date_to_check)

def is_today(date_to_check: date) -> bool:
    return date_to_check == date.today()

def is_yesterday(date_to_check: date) -> bool:
    return date_to_check == date.today() - timedelta(days=1)

def is_tomorrow(date_to_check: date) -> bool:
    return date_to_check == date.today() + timedelta(days=1)

def is_same_day(date1: date, date2: date) -> bool:
    return date1 == date2

def is_same_month(date1: date, date2: date) -> bool:
    return date1.month == date2.month and date1.year == date2.year

def is_same_year(date1: date, date2: date) -> bool:
    return date1.year == date2.year

def is_leap_year(year: int) -> bool:
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

def days_in_month(year: int, month: int) -> int:
    if month == 2 and is_leap_year(year):
        return 29
    return {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }[month]

def days_in_year(year: int) -> int:
    return 366 if is_leap_year(year) else 365

def is_valid_date(year: int, month: int, day: int) -> bool:
    if month < 1 or month > 12:
        return False
    if day < 1 or day > days_in_month(year, month):
        return False
    return True