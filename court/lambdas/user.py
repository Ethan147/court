import json
from typing import Any, Dict, Tuple

from psycopg2 import Error, connect

from court.utils import validation as valid
from court.utils.aws_cognito import cognito_sign_up
from court.utils.db import Cursor


def validate_all_fields(body: Dict[str, Any]) -> Tuple[bool, str]:
    required_fields = ["first_name", "last_name", "email", "gender", "password", "dob", "address", "consent"]

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

    if not valid.validate_terms_accepted(body['consent']):
        return False, "Consent must be accepted"

    return True, ""

# TODO: this should also include consent to terms and conditions as well as what version those terms & conditions are
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

    # Store user in database
    try:
        with Cursor() as curs:
            query = """
            INSERT INTO user_characteristics (first_name, last_name, email, gender, dob, address, consent, cognito_user_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (body["first_name"], body["last_name"], body["email"], body["gender"], body["dob"], body["address"], body["consent"], cognito_user_id)
            curs.execute(query, values)

    except Error as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
