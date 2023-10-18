import unittest
import uuid
from datetime import date

from court.utils.db import CursorCommit, CursorRollback
from court.utils.user import create_user


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
            create_user(
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
            curs.execute(
                """
                delete from public.user_account_terms_consent
                where user_account_id in (
                    select id from public.user_account
                    where first_name = 'test_first_name_test_create_valid_user'
                    and last_name = 'test_last_name'
                )
                """
            )
            curs.execute(
                """
                delete from public.user_account
                where first_name = 'test_first_name_test_create_valid_user'
                and last_name = 'test_last_name'
                """
            )
