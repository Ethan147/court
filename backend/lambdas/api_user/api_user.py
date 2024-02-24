import json
import re
from datetime import datetime
from typing import Any, Dict, Optional

from aws_cognito import cognito_sign_up
from dateutil.relativedelta import relativedelta
from db_connector import CursorCommit, CursorRollback
from pydantic import BaseModel, EmailStr, ValidationError, constr, validator
from session import get_prune_active_or_create_session
from user import create_or_update_user

MIN_AGE = 16

class SignupRequest(BaseModel):
    first_name: constr(min_length=1, pattern="^[a-zA-Z]+$")  # type: ignore
    last_name: constr(min_length=1, pattern="^[a-zA-Z]+$")  # type: ignore
    email: EmailStr
    gender: constr(pattern="^(male|female|other)$")  # type: ignore
    password: str
    dob: datetime
    address: constr(min_length=1)  # type: ignore
    terms_consent_version: constr(min_length=1)  # type: ignore
    device_identifier: constr(min_length=1)  # type: ignore
    google_place_id: constr(min_length=1)  # type: ignore

    @validator('password')
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not bool(re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$", v)):
            raise ValueError("Weak password")

        return v

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

def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    API endpoint for user signups

    todo: should the sign-in API request address at all?
    If so, mailing address? play location? both? neither?

    A: yes, a first play location that they can add onto later (later, maybe expand to multiple play locations?)
    """

    try:
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',  # or specify your domain
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                'body': None
            }

        signup_request = SignupRequest(**json.loads(event.get("body", "{}")))

        response = cognito_sign_up(signup_request.model_dump())
        cognito_user_id = response["UserSub"]

        user_account_id = create_or_update_user(
            cognito_user_id,
            signup_request.first_name,
            signup_request.last_name,
            signup_request.email,
            signup_request.gender,
            signup_request.dob,
            signup_request.terms_consent_version,
        )
        get_prune_active_or_create_session(
            user_account_id,
            signup_request.device_identifier
        )

    except ValidationError as e:
        return {"statusCode": 400, "body": json.dumps({"message": str(e)})}

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
