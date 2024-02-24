import json
import unittest
from datetime import date, datetime
from typing import Any, Dict, List, Optional
from unittest.mock import patch

from db_connector import CursorCommit, CursorRollback
from pydantic import ValidationError
from user import find_user

from backend.lambdas.api_user import api_user

# from aws_cognito import cognito_sign_up

def _get_testing_body() -> Dict[str, Any]:
    test_headers = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "test@email.com",
        "gender": "male",
        "password": "SomePassword1.",
        "dob": "2000-12-12T00:00:00",
        "address": "123 Fake St, Austin TX",
        "terms_consent_version": 'x.x.x',
        "device_identifier": "some_device_identifier"
    }
    return test_headers

def _testing_body(missing_headers: List[str]) -> Dict[str, Any]:
    test_headers = _get_testing_body()
    return {
        key: val for key, val in test_headers.items()
        if key not in missing_headers
    }

def _get_testing_headers() -> Dict[str,Any]:
    return {
        "User-Agent": "test_some_user_agent",
    }

class TestValidateAllFields(unittest.TestCase):
    def setUp(self) -> None:
        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('x.x.x', 'test', now())
            """)

    def tearDown(self) -> None:
        with CursorCommit() as curs:
            curs.execute("""
                delete from public.terms_and_conditions
                where version = 'x.x.x' and terms_text = 'test'
            """)

    def test_missing_fields(self) -> None:
        for field in _get_testing_body().keys():
            with self.subTest(field=field):
                data = {k: v for k, v in _get_testing_body().items() if k != field}
                with self.assertRaises(ValidationError):
                    api_user.SignupRequest(**data)

    def test_valid_data_no_raised_error(self) -> None:
        api_user.SignupRequest(**_get_testing_body())

    def test_password_too_short(self) -> None:
        data = _get_testing_body()
        data['password'] = 'weak'

        with self.assertRaises(ValidationError):
            api_user.SignupRequest(**data)

    def test_weak_password(self) -> None:
        data = _get_testing_body()
        data['password'] = 'Thispasswordislongbutweak'

        with self.assertRaises(ValidationError):
            api_user.SignupRequest(**data)

    def test_age_restriction(self) -> None:
        data = _get_testing_body().copy()
        data['dob'] = datetime.now()

        with self.assertRaises(ValidationError):
            api_user.SignupRequest(**data)

    def test_terms_consent_version(self):
        latest_version = 'x.x.x'
        data = _get_testing_body().copy()
        data['terms_consent_version'] = 'old-version'
        with self.assertRaises(ValidationError):
            api_user.SignupRequest(**data)

        data['terms_consent_version'] = latest_version
        api_user.SignupRequest(**data)  # should not raise

class TestLambdaRegister(unittest.TestCase):

    def setUp(self) -> None:
        super().setUp()
        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('x.x.x', 'test', now())
            """)

    def tearDown(self) -> None:
        super().setUp()
        with CursorCommit() as curs:
            curs.execute("""
                delete from public.terms_and_conditions
                where version = 'x.x.x' and terms_text = 'test'
            """)

    def test_lambda_register_missing_field(self) -> None:
        event = {
            'body': json.dumps(_testing_body(["first_name"])),
            'headers': json.dumps(_get_testing_headers())
        }
        response = api_user.lambda_register(event, None)
        self.assertEqual(response['statusCode'], 400)
        self.assertTrue("validation error for SignupRequest" in response['body'])

    def test_lambda_register_cognito_issue(self) -> None:
        def cognito_sign_up(body: Dict[str, Any]) -> None:
            raise ValueError("test cognito sign up issue")

        with patch('aws_cognito.cognito_sign_up', side_effect=cognito_sign_up):
            event = {
                'body': json.dumps(_testing_body([])),
                'headers': json.dumps(_get_testing_headers())
            }
            response = api_user.lambda_register(event, None)
            self.assertEqual(response['statusCode'], 500)
            self.assertEqual(response['body'], '{"message": "test cognito sign up issue"}')

    def test_lambda_register_create_user_issue(self) -> None:

        def cognito_sign_up(body: Dict[str, Any]) -> Dict[str, str]:
            return {"UserSub": "cognito_user_id"}

        def create_or_update_user(
            cognito_user_id: str,
            first_name: str,
            last_name: str,
            email: str,
            gender_category: str,
            date_of_birth: date,
            terms_consent_version: str,
            gender_self_specify: Optional[str] = None,
        ) -> None:
            raise ValueError("test create_or_update_user issue")

        with patch('aws_cognito.cognito_sign_up', side_effect=cognito_sign_up):
            with patch('user.create_or_update_user', side_effect=create_or_update_user):
                event = {
                    'body': json.dumps(_testing_body([])),
                    'headers': json.dumps(_get_testing_headers())
                }
                response = api_user.lambda_register(event, None)
                self.assertEqual(response['statusCode'], 500)
                self.assertEqual(response['body'], '{"message": "test create_or_update_user issue"}')

    def test_lambda_register_successful_user_creation(self) -> None:
        def cognito_sign_up(body: Dict[str, Any]) -> Dict[str, str]:
            return {"UserSub": "cognito_user_id"}

        self.assertTrue(find_user(email='test@email.com') is None)

        with patch('aws_cognito.cognito_sign_up', side_effect=cognito_sign_up):
            event = {
                'body': json.dumps(_testing_body([])),
                'headers': json.dumps(_get_testing_headers())
            }
            _ = api_user.lambda_register(event, None)

        found_user = find_user(email='test@email.com')
        self.assertTrue(found_user is not None)

        # User terms consent will be inserted, a session will be created,
        # no history will be created because there is not an extension
        with CursorRollback() as curs:
            curs.execute(
                "select count(*) from public.user_account_terms_consent where user_account_id = %s",
                (found_user.id,)   # type: ignore
            )
            _count_user_accounts = curs.fetchone()[0]
            self.assertEqual(_count_user_accounts, 1)

            curs.execute(
                "select count(*) from public.user_session where user_account_id = %s",
                (found_user.id,)   # type: ignore
            )
            _count_user_sessions = curs.fetchone()[0]
            self.assertEqual(_count_user_sessions, 1)

            curs.execute(
                """
                    select count(*) from public.user_session_history ush
                    join public.user_session us
                    on us.session_uuid = ush.session_uuid
                    where us.user_account_id = %s
                """,
                (found_user.id,)  # type: ignore
            )
            _count_user_session_history = curs.fetchone()[0]
            self.assertEqual(_count_user_session_history, 0)

        with CursorCommit() as curs:
            curs.execute("""
                delete from public.user_session
                where user_account_id in (select id from public.user_account where email = 'test@email.com')
            """)
            curs.execute("""
                delete from public.user_account_terms_consent
                where user_account_id in (select id from public.user_account where email = 'test@email.com')
            """)
            curs.execute(
                "delete from public.user_account where email = 'test@email.com'"
            )
