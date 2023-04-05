import json
from typing import Any, Dict


# TODO: from aws_lambda_context import LambdaContext (instead of Any)
def lambda_hello(event: Dict, context: Any) -> Dict[str, Any]:
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello, World!"
        }),
    }
    return response
