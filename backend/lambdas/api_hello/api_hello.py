from typing import Any, Dict

from db_connector import CursorCommit, CursorRollback


def lambda_hello(event: Dict, _: Any) -> Dict[str, Any]:
    """
    As a first request for a user,
    only gather the expected primary play location for the user
    """

    return {
        'statusCode': 200,
        'body': 'Hello World'
    }
