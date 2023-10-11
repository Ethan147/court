import json
from typing import Any, Dict, Tuple

import boto3
from psycopg2 import Error, connect

from court.utils import validation as valid
from court.utils.env_conf import db_host, db_name, db_pass, db_user

# AWS SDK client for Cognito
# client = boto3.client('cognito-idp')

# TODO: Set up these constants
USER_POOL_ID = "YOUR_COGNITO_USER_POOL_ID"
CLIENT_ID = "YOUR_COGNITO_APP_CLIENT_ID"


# TODO: from aws_lambda_context import LambdaContext (instead of Any)
def lambda_hello(event: Dict, context: Any) -> Dict[str, Any]:
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello, World!"
        }),
    }
    return response


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

    return True, "All fields are valid"

def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    body = json.loads(event.get("body", "{}"))

    # Input validation
    is_valid, message = validate_all_fields(body)

    if not is_valid:
        return {"statusCode": 400, "body": json.dumps({"message": message})}

    # Register user in Cognito
    try:
        # response = client.sign_up(
        #     ClientId=CLIENT_ID,
        #     Username=body["email"],
        #     Password=body["password"],
        #     UserAttributes=[
        #         {"Name": "email", "Value": body["email"]},
        #         {"Name": "phone_number", "Value": body.get("phone_number", "")},
        #     ]
        # )
        # cognito_user_id = response["UserSub"]
        cognito_user_id = 42
        pass
    except Exception as e:
        # TODO: Handle specific exceptions like user already exists, weak password, etc.
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    # Store other user details in PostgreSQL
    try:
        with connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_pass
        ) as conn:
            cur = conn.cursor()

            # SQL query to insert the data
            query = """
            INSERT INTO user_characteristics (first_name, last_name, email, gender, dob, address, consent, cognito_user_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (body["first_name"], body["last_name"], body["email"], body["gender"], body["dob"], body["address"], body["consent"], cognito_user_id)

            cur.execute(query, values)
            conn.commit()
    except Error as e:
        return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {"statusCode": 201, "body": json.dumps({"message": "User registered successfully!"})}
