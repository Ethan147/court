import json
import unittest
from typing import Any, Dict, List

from court.lambdas.user import lambda_register, validate_all_fields


def _testing_body(missing_headers: List[str]) -> Dict[str, Any]:
    test_headers = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "test@email.com",
        "gender": "male",
        "password": "SomePassword1.",
        "dob": "12/12/2000",
        "address": "123 Fake St, Austin TX",
        "consent": True
    }

    return {
        key: val for key, val in test_headers.items()
        if key not in missing_headers
    }


class TestValidateAllFields(unittest.TestCase):

    def test_missing_fields(self) -> None:
        for field in ["first_name", "last_name", "email", "gender", "password", "dob", "address", "consent"]:
            body = _testing_body([field])
            is_valid, message = validate_all_fields(body)
            self.assertFalse(is_valid)
            self.assertEqual(message, f"Missing field: {field}")

    def test_no_missing_fields(self) -> None:
        body = _testing_body([])
        is_valid, message = validate_all_fields(body)
        self.assertTrue(is_valid)
        self.assertEqual(message, "")


class TestLambdaRegister(unittest.TestCase):

    def test_lambda_register_missing_field(self):
        event = {'body': json.dumps(_testing_body(["first_name"]))}
        response = lambda_register(event, None)
        self.assertEqual(response['statusCode'], 400)
        self.assertEqual(response['body'], '{"message": "Missing field: first_name"}')
