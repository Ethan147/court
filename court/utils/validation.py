import re
from datetime import datetime

MIN_AGE = 16

def validate_name(name: str) -> bool:
    return bool(re.match("^[a-zA-Z]+$", name))

def validate_email(email: str) -> bool:
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False

    return bool(re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$", password))

def validate_gender(gender: str) -> bool:
    return gender.lower() in ["male", "female", "other"]

def validate_age(age: int) -> bool:
    return age > MIN_AGE

def validate_birthdate(birthdate: str) -> bool:
    """ date format MM/DD/YYYY """
    try:
        datetime.strptime(birthdate, "%m/%d/%Y")
        return True
    except ValueError:
        return False

def validate_address(address: str) -> bool:
    return type(address) is str

def validate_terms_accepted(terms_accepted: bool) -> bool:
    return terms_accepted
