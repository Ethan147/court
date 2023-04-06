import json
import unittest
from typing import Any, Dict

from court.app import lambda_hello


class TestLambdaHello(unittest.TestCase):
    def test_lambda_hello(self):
        mock_event = {}
        mock_context = None

        response = lambda_hello(mock_event, mock_context)

        expected_response = {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Hello, World!"
            }),
        }

        self.assertEqual(response, expected_response)
