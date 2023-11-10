import unittest
import uuid
from datetime import date
from typing import Optional

import psycopg2

from court.utils.db import CursorCommit, CursorRollback
from court.utils.user import UserAccount, create_or_update_user, find_user


class TestUserUtilities(unittest.TestCase):

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

    def test_create_valid_user(self) -> None:
        valid_gender_categories = [
            ("male", None),
            ("female", None),
            ("other", None),
            ("other", "nonbinary")
        ]

        for gender_category, self_specify in valid_gender_categories:
            test_uuid = str(uuid.uuid4())
            create_or_update_user(
                cognito_user_id=test_uuid,
                first_name='test_first_name_test_create_valid_user',
                last_name='test_last_name',
                email=f"testemail{test_uuid}@example.com",
                gender_category=gender_category,
                date_of_birth=date(2000,1,1),
                terms_consent_version='x.x.x',
                gender_self_specify=self_specify
            )

        # Confirm create_user inserts into user_account and terms and conditions
        with CursorRollback() as curs:
            curs.execute("""
                select gender_category, gender_self_specify from public.user_account
                where first_name = 'test_first_name_test_create_valid_user'
                and last_name = 'test_last_name'
                order by gender_category asc, gender_self_specify asc
            """)
            users = curs.fetchall()
            self.assertEqual(users, [('male', None), ('female', None), ('other', 'nonbinary'), ('other', None)])

            curs.execute("""
                select terms.version from public.user_account_terms_consent map
                join public.terms_and_conditions terms
                on map.terms_and_conditions_id = terms.id
                join public.user_account u
                on u.id = map.user_account_id
                where u.first_name = 'test_first_name_test_create_valid_user'
                and u.last_name = 'test_last_name'
                order by u.gender_category asc, u.gender_self_specify asc
            """)
            terms_consent = curs.fetchall()
            self.assertEqual(terms_consent, [('x.x.x',), ('x.x.x',), ('x.x.x',), ('x.x.x',)])


        # remove changes for test-isolation
        with CursorCommit() as curs:
            curs.execute("""
                delete from public.user_account_terms_consent
                where user_account_id in (select id from public.user_account where first_name = 'test_first_name_test_create_valid_user')
            """)
            curs.execute(
                "delete from public.user_account where first_name = 'test_first_name_test_create_valid_user'"
            )

    def test_create_invalid_user(self) -> None:
        with self.assertRaises(psycopg2.errors.InvalidTextRepresentation):
            test_uuid = str(uuid.uuid4())
            create_or_update_user(
                cognito_user_id=test_uuid,
                first_name='test_first_name_test_create_valid_user',
                last_name='test_last_name',
                email=f"testemail{test_uuid}@example.com",
                gender_category="invalid gender category",
                date_of_birth=date(2000,1,1),
                terms_consent_version='x.x.x',
            )

    def test_double_create_or_upsert_user(self) -> None:
        def _matching_user_count() -> int:
            with CursorRollback() as curs:
                curs.execute("select count(*) from public.user_account where first_name = 'test_double_create_or_upsert_user'")
                count = curs.fetchone()[0]

            return count

        pre_any_insert_count = _matching_user_count()

        test_uuid = str(uuid.uuid4())
        user_first_insert_id = create_or_update_user(
            cognito_user_id=test_uuid,
            first_name='test_double_create_or_upsert_user',
            last_name='test_last_name',
            email=f"testemail{test_uuid}@example.com",
            gender_category="male",
            date_of_birth=date(2000,1,1),
            terms_consent_version='x.x.x',
        )
        post_first_insert_count = _matching_user_count()

        user_second_insert_id = create_or_update_user(
            cognito_user_id=test_uuid,
            first_name='test_double_create_or_upsert_user',
            last_name='test_last_name',
            email=f"testemail{test_uuid}@example.com",
            gender_category="male",
            date_of_birth=date(2000,1,1),
            terms_consent_version='x.x.x',
        )
        post_second_insert_count = _matching_user_count()

        self.assertEqual(post_first_insert_count - pre_any_insert_count, 1)
        self.assertEqual(post_second_insert_count - pre_any_insert_count, 1)
        self.assertEqual(user_first_insert_id, user_second_insert_id)

        with CursorCommit() as curs:
            curs.execute("""
                delete from public.user_account_terms_consent
                where user_account_id in (select id from public.user_account where first_name = 'test_double_create_or_upsert_user')
            """)
            curs.execute(
                "delete from public.user_account where first_name = 'test_double_create_or_upsert_user'"
            )

    def test_find_user(self) -> None:

        def _confirm_result(expected_user_id: int, found_user_account: Optional[UserAccount]) -> None:
            self.assertTrue(bool(found_user_account))
            self.assertEqual(expected_user_id, found_user_account.id)  # type: ignore
            self.assertTrue(bool(found_user_account.id))  # type: ignore
            self.assertTrue(bool(found_user_account.user_uuid))  # type: ignore
            self.assertTrue(bool(found_user_account.cognito_user_id))  # type: ignore
            self.assertTrue(bool(found_user_account.first_name))  # type: ignore
            self.assertTrue(bool(found_user_account.last_name))  # type: ignore
            self.assertTrue(bool(found_user_account.email))  # type: ignore
            self.assertTrue(bool(found_user_account.gender_category))  # type: ignore
            self.assertTrue(bool(found_user_account.dob))  # type: ignore
            self.assertTrue(bool(found_user_account.created_at))  # type: ignore
            self.assertTrue(bool(found_user_account.updated_at))  # type: ignore

        test_uuid = str(uuid.uuid4())
        first_name = 'test_find_user'
        last_name = 'test_last_name'
        email = f"testemail{test_uuid}@example.com"
        gender_category = "male"
        date_of_birth=date(2000,1,1)
        terms_consent_version='x.x.x'

        expected_user_id = create_or_update_user(
            cognito_user_id=test_uuid,
            first_name=first_name,
            last_name=last_name,
            email=email,
            gender_category=gender_category,
            date_of_birth=date_of_birth,
            terms_consent_version=terms_consent_version,
        )

        with CursorRollback() as curs:
            curs.execute("select user_uuid from public.user_account where id = %s", (expected_user_id,))
            expected_user_uuid = curs.fetchone()[0]

        # find_user will discover a user according to an array of identifiers
        _confirm_result(expected_user_id, find_user(user_uuid=expected_user_uuid))
        _confirm_result(expected_user_id, find_user(cognito_user_id=test_uuid))
        _confirm_result(expected_user_id, find_user(email=email))
        _confirm_result(expected_user_id, find_user(first_name=first_name, last_name=last_name, dob=date_of_birth))
        _confirm_result(expected_user_id, find_user(
            user_uuid=expected_user_uuid,
            cognito_user_id=test_uuid,
            email=email,
            first_name=first_name,
            last_name=last_name,
            dob=date_of_birth,
        ))

        # find user will not find a user unless first_name, last_name, and dob are all passed in
        self.assertTrue(find_user(first_name=None, last_name=last_name, dob=date_of_birth) is None)
        self.assertTrue(find_user(first_name=first_name, last_name=None, dob=date_of_birth) is None)
        self.assertTrue(find_user(first_name=first_name, last_name=last_name, dob=None) is None)

        with CursorCommit() as curs:
            curs.execute("""
                delete from public.user_account_terms_consent
                where user_account_id in (select id from public.user_account where first_name = 'test_find_user')
            """)
            curs.execute(
                "delete from public.user_account where first_name = 'test_find_user'"
            )


# todo test that error is raised when multiple users are found (find_user)
