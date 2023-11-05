import json
from typing import Any, Dict, Tuple

from psycopg2 import Error, connect

from court.utils import validation as valid
from court.utils.aws_cognito import cognito_sign_up
from court.utils.db import CursorCommit, CursorRollback
from court.utils.session import handle_session_creation
from court.utils.user import create_or_update_user


# todo on final pass, audit this area to confirm proper validation
def validate_all_fields(body: Dict[str, Any]) -> Tuple[bool, str]:
    required_fields = ["first_name", "last_name", "email", "gender", "password", "dob", "address", "terms_consent_version"]

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

    return True, ""

# todo find way to account for user sessioning
@handle_session_creation
def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    API endpoint for user signups
    """

    body = json.loads(event.get("body", "{}"))
    is_valid, message = validate_all_fields(body)
    if not is_valid:
        return {"statusCode": 400, "body": json.dumps({"message": message})}

    # Register user in Cognito
    try:
        response = cognito_sign_up(body)
        cognito_user_id = response["UserSub"]
        pass
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}


    # todo update to create address
    # todo update caller to include gender category
    try:
        create_or_update_user(
            cognito_user_id,
            body["first_name"],
            body["last_name"],
            body["email"],
            body["gender"],
            body["dob"],
            body["terms_consent_version"],
        )

    except Error as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
