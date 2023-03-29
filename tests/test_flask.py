import unittest

from flask import json

from court.app import create_app


# TODO remove this test in favor of other (real) endpoints when they're created
class TestHelloWorldEndpoint(unittest.TestCase):

    def setUp(self) -> None:
        self.app = create_app()
        self.client = self.app.test_client()

    def test_hello_world(self) -> None:
        response = self.client.get("/hello")
        self.assertEqual(response.status_code, 200)

        # Add more assertions to test the content of the response, e.g.:
        # data = json.loads(response.data)
        # self.assertTrue("Account values:" in data["message"])
