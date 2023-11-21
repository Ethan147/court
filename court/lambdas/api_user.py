import json
from typing import Any, Dict, Tuple

from court.utils import validation as valid
from court.utils.aws_cognito import cognito_sign_up
from court.utils.db import CursorCommit, CursorRollback
from court.utils.session import get_prune_active_or_create_session
from court.utils.user import create_or_update_user


def validate_all_fields(body: Dict[str, Any]) -> Tuple[bool, str]:
    required_fields = ["first_name", "last_name", "email", "gender", "password", "dob", "address", "terms_consent_version", "device_identifier"]

    for field in required_fields:
        if field not in body:
            return False, f"Missing field: {field}"

    if not valid.validate_name(body['first_name']) or not valid.validate_name(body['last_name']):
        return False, "Invalid name format"

    if not valid.validate_email(body['email']):
        return False, "Invalid email format"

    if not valid.validate_password(body['password']):
        return False, "Weak password"

    if not valid.validate_gender(body['gender']):
        return False, "Invalid gender"

    if not valid.validate_birthdate(body['dob']):
        return False, "Invalid date of birth"

    if not valid.validate_address(body['address']):
        return False, "Invalid address"

    if not valid.validate_terms_accepted(body['terms_consent_version']):
        return False, "Most recent terms and condition must be accepted"

    if not valid.validate_device_identifier(body["device_identifier"]):
        return False, "Invalid device identifier"

    return True, ""

def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    API endpoint for user signups

    todo: should the sign-in API request address at all?
    If so, mailing address? play location? both? neither?

    A: yes, a first play location that they can add onto later (later, maybe expand to multiple play locations?)
    """

    body = json.loads(event.get("body", "{}"))
    is_valid, message = validate_all_fields(body)
    if not is_valid:
        return {"statusCode": 400, "body": json.dumps({"message": message})}

    try:
        response = cognito_sign_up(body)
        cognito_user_id = response["UserSub"]
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}


    # todo update to create address
    try:
        user_account_id = create_or_update_user(
            cognito_user_id,
            body["first_name"],
            body["last_name"],
            body["email"],
            body["gender"],
            body["dob"],
            body["terms_consent_version"],
        )
        get_prune_active_or_create_session(
            user_account_id,
            body["device_identifier"]
        )

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
