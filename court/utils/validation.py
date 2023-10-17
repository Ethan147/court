import re
from datetime import datetime

from court.utils.db import CursorRollback

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

def validate_terms_accepted(terms_consent_version: str) -> bool:
    with CursorRollback() as curs:
        curs.execute(
            "select version from public.terms_and_conditions order by created_at desc"
            )
        most_recent_terms_version = curs.fetchone()
        raise ValueError(most_recent_terms_version)
        return most_recent_terms_version == terms_consent_version
