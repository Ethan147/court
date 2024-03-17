import json
import os
import re
import traceback
import uuid
from datetime import datetime
from typing import Any, Dict, Optional, Tuple

import boto3
import requests
from aws_cognito import cognito_sign_up
from dateutil.relativedelta import relativedelta
from db_connector import Cursor, CursorCommit, CursorRollback
from pydantic import BaseModel, EmailStr, ValidationError, constr, validator
from session import get_prune_active_or_create_session
from user import create_or_update_user, insert_user_play_location

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


def _get_place_details(google_place_id: str) -> Tuple[str, float, float]:
    google_api_key = os.environ.get("PLACES_KEY")
    google_places_detail_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={google_place_id}&fields=address_component,geometry&key={google_api_key}"

    response_body = requests.get(google_places_detail_url)
    response_data = response_body.json()

    for component in response_data.get("result", {}).get("address_components", []):
        if "postal_code" in component.get("types", []):
            _zip = component.get("long_name")

    geometry = response_data.get("result", {}).get("geometry", {}).get("location", {})
    latitude = geometry.get("lat")
    longitude = geometry.get("lng")

    return _zip, latitude, longitude

def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    As a first request for a user,
    only gather the expected primary play location for the user
    """
    with Cursor() as curs:
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
            address_zip, latitude, longitude = _get_place_details(signup_request.google_place_id)

            user_uuid = str(uuid.uuid4()),
            response = cognito_sign_up(user_uuid, signup_request.model_dump())
            cognito_user_id = response["UserSub"]

            user_account_id = create_or_update_user(
                curs,
                cognito_user_id,
                signup_request.first_name,
                signup_request.last_name,
                signup_request.email,
                signup_request.gender,
                signup_request.dob,
                signup_request.terms_consent_version,
            )

            address_line_1, city, state, country = signup_request.address.split(",")
            insert_user_play_location(
                curs = curs,
                user_account_id = user_account_id,
                address_line_1 = address_line_1,
                address_line_2 = None,
                city = city,
                state = state,
                country = country,
                postal_code= address_zip,
                longitude = longitude,
                latitude = latitude
            )

            get_prune_active_or_create_session(
                curs,
                user_account_id,
                signup_request.device_identifier
            )
            curs.commit()

        except ValidationError as e:
            # curs.rollback()
            print(traceback.print_exc())
            return {"statusCode": 400, "body": json.dumps({"message": str(e)})}

        except Exception as e:
            # curs.rollback()
            print(traceback.print_exc())
            return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
