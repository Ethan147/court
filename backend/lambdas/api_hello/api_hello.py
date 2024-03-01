from typing import Any, Dict


def lambda_hello(event: Dict, _: Any) -> Dict[str, Any]:
    """
    As a first request for a user,
    only gather the expected primary play location for the user
    """
    # try:
    #     if event.get('httpMethod') == 'OPTIONS':
    #         return {
    #             'statusCode': 200,
    #             'headers': {
    #                 'Access-Control-Allow-Origin': '*',  # or specify your domain
    #                 'Access-Control-Allow-Methods': 'POST',
    #                 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    #             },
    #             'body': None
    #         }

    # except ValidationError as e:
    #     return {"statusCode": 400, "body": json.dumps({"message": str(e)})}

    # except Exception as e:
    #     return {"statusCode": 500, "body": json.dumps({"message": str(e)})}

    return {
        'statusCode': 200,
        'body': 'Hello World'
    }
