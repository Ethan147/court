"""
Utilities for interacting with aws cognito
"""
from typing import Any, Dict

import boto3
from utils.env_conf import cognito_client_id

client = boto3.client('cognito-idp')

def cognito_sign_up(body: Dict[str, Any]) -> Dict[str, Any]:
    return client.sign_up(
        ClientId=cognito_client_id,
        Username=body["email"],
        Password=body["password"],
        UserAttributes=[
            {"Name": "email", "Value": body["email"]},
            {"Name": "phone_number", "Value": body.get("phone_number", "")},
        ]
    )
