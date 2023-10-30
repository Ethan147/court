import unittest
import uuid
from datetime import date, datetime, timedelta

from court.utils.db import CursorCommit, CursorRollback
from court.utils.session import (_prune_sessions, extend_session,
                                 get_prune_sessions)
from court.utils.user import create_or_update_user


class TestSessionManagement(unittest.TestCase):

    def setUp(self) -> None:
        """ Create valid user and user session """
        super().setUp()

        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('x.x.x', 'test', now())
            """)

        self.test_uuid = str(uuid.uuid4())

        self.user_id = create_or_update_user(
            self.test_uuid,
            "test_user_first_name",
            "test_user_last_name",
            "testsessionmanagement@example.com",
            "male",
            date(2000,1,1),
            'x.x.x',
        )

        self.session_uuid_current = str(uuid.uuid4())
        self.session_uuid_expired = str(uuid.uuid4())

        with CursorCommit() as curs:
            curs.execute("""
                insert into user_session
                    (session_uuid, user_id, token, device_identifier, device_type, platform, expires_at)
                values
                    (%s, %s, 'test_token', 'test_device_identifier', 'test_device_type', 'web', %s),
                    (%s, %s, 'test_token', 'test_device_identifier', 'test_device_type', 'web', %s),
            """,
                (
                    self.session_uuid_current, self.user_id, datetime.utcnow() + timedelta(hours=1),
                    self.session_uuid_expired, self.user_id, datetime.utcnow() - timedelta(hours=1),
                )
            )


    def tearDown(self) -> None:
        """ Clear up data created only for these tests to ensure compartmentalization """
        super().tearDown()
        with CursorCommit() as curs:
            curs.execute(
                "delete from user_session where session_uuid in (%s, %s)", (self.session_uuid_current, self.session_uuid_expired)
            )
            curs.execute(
                "delete from public.terms_and_conditions where version = 'x.x.x' and terms_text = 'test'"
            )
            curs.execute(
                "delete from public.user_account where email = 'testsessionmanagement@example.com'"
            )


    def test_prune_sessions(self) -> None:
        pass
        # _prune_sessions(self.user_id)
        # with CursorRollback() as curs:
        #     curs.execute("select is_active from user_session where session_uuid = %s", (self.session_uuid,))
        #     is_active = curs.fetchone()[0]
        #     self.assertTrue(is_active)

        # # Given an active session that's expired
        # with CursorCommit() as curs:
        #     curs.execute("""
        #         update user_session
        #         set expires_at = %s
        #         where session_uuid = %s
        #     """, (datetime.utcnow() - timedelta(hours=1), self.session_uuid))

        # _prune_sessions(self.user_id)
        # with CursorRollback() as curs:
        #     curs.execute("select is_active from user_session where session_uuid = %s", (self.session_uuid,))
        #     is_active = curs.fetchone()[0]
        #     self.assertFalse(is_active)

    # def test_extend_session(self) -> None:
    #     extend_session(self.session_uuid, "user activity", 48)
    #     with CursorRollback() as curs:
    #         curs.execute("select expires_at from user_session where session_uuid = %s", (self.session_uuid,))
    #         expires_at = curs.fetchone()[0]
    #         self.assertTrue(expires_at > datetime.utcnow() + timedelta(hours=47))

    #     curs.execute("select count(*) from user_session_history where session_uuid = %s", (self.session_uuid,))
    #     history_count = curs.fetchone()[0]
    #     self.assertEqual(history_count, 1)

    # # TODO: Add more tests for other functions and edge cases.
