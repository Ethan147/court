import json
from typing import Any, Dict

from pydantic import ValidationError

from court.utils.aws_cognito import cognito_sign_up
from court.utils.db import CursorCommit, CursorRollback
from court.utils.session import get_prune_active_or_create_session
from court.utils.user import create_or_update_user
from court.utils.validation import SignupRequest


def lambda_register(event: Dict, _: Any) -> Dict[str, Any]:
    """
    API endpoint for user signups

    todo: should the sign-in API request address at all?
    If so, mailing address? play location? both? neither?

    A: yes, a first play location that they can add onto later (later, maybe expand to multiple play locations?)
    """

    try:
        # Parse and validate the request body using Pydantic
        signup_request = SignupRequest(**json.loads(event.get("body", "{}")))

        response = cognito_sign_up(signup_request.dict())
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
