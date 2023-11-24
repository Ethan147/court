import re
from datetime import datetime

from dateutil.relativedelta import relativedelta
from pydantic import BaseModel, EmailStr, constr, validator

from court.utils.db import CursorRollback

MIN_AGE = 16

class SignupRequest(BaseModel):
    first_name: constr(min_length=1, strip_whitespace=True, regex=r"^[a-zA-Z]+$")  # type: ignore
    last_name: constr(min_length=1, strip_whitespace=True, regex=r"^[a-zA-Z]+$")  # type: ignore
    email: EmailStr
    gender: constr(regex=r"^(male|female|other)$")  # type: ignore
    password: constr(min_length=8, regex=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$")  # type: ignore
    dob: datetime
    address: constr(min_length=1)  # type: ignore
    terms_consent_version: constr(min_length=1)  # type: ignore
    device_identifier: constr(min_length=1)  # type: ignore

    @validator('dob')
    def validate_age(cls, v: datetime) -> datetime:
        if relativedelta(datetime.now(), v).years < MIN_AGE:
            raise ValueError(f"Age must be at least {MIN_AGE} years")
        return v

    @validator('terms_consent_version')
    def validate_terms_accepted(cls, v: str) -> str:
        with CursorRollback() as curs:
            curs.execute("select version from public.terms_and_conditions order by created_at desc")
            most_recent_version = curs.fetchone()
            if not most_recent_version or most_recent_version[0] != v:
                raise ValueError("Terms and conditions version does not match the most recent version.")
            return v
