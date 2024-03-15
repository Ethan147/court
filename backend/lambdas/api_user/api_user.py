import json
import re
import uuid
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
    dob: str
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
    def validate_age(cls, v: str) -> str:
        try:
            dob_datetime = datetime.strptime(v, '%m/%d/%Y')
        except ValueError:
            raise ValueError("Invalid date format. Please use MM/DD/YYYY format.")

        if relativedelta(datetime.now(), dob_datetime).years < MIN_AGE:
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


# todo Google Places API's Place Details request (google places API to request about this)
def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    As a first request for a user,
    only gather the expected primary play location for the user
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

        user_uuid = str(uuid.uuid4()),
        response = cognito_sign_up(user_uuid, signup_request.model_dump())
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

        # todo: postal code will have to be gathered from the Googe Places API Place Details request
        address_line_1, city, state, country = signup_request.address.split(",")
        insert_user_play_location(
            user_account_id = user_account_id,
            address_line_1 = address_line_1,
            address_line_2 = None,
            city = city,
            state = state,
            country = country,
            postal_code= None,  # todo this does not seem to be provided by the google places API
            longitude = 0.0,
            latitude = 0.0
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
