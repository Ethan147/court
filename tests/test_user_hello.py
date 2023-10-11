import json
import unittest
from typing import Any, Dict

from court.lambdas.user import (lambda_hello, lambda_register,
                                validate_all_fields)


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

# TODO: these are failing at the moment
class TestValidateAllFields(unittest.TestCase):
    def test_missing_field(self):
        body = {"first_name": "John"}  # Missing many required fields
        is_valid, message = validate_all_fields(body)
        self.assertFalse(is_valid)
        self.assertEqual(message, "Missing field: last_name")

    def test_invalid_email(self):
        body = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "invalid",
            # ... rest of the required fields
        }
        is_valid, message = validate_all_fields(body)
        self.assertFalse(is_valid)
        self.assertEqual(message, "Invalid email format")

    # Add similar tests for all other validators

class TestLambdaRegister(unittest.TestCase):
    def test_lambda_register_missing_field(self):
        event = {'body': json.dumps({"first_name": "John"})}
        response = lambda_register(event, None)
        self.assertEqual(response['statusCode'], 400)

    # Add similar tests for other paths in the lambda function
