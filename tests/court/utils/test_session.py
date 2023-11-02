import unittest
import uuid
from datetime import date, datetime, timedelta
from typing import Any, List

from court.utils.db import CursorCommit, CursorRollback
from court.utils.session import (_create_user_session, _prune_sessions,
                                 extend_session, get_prune_active_sessions)
from court.utils.user import create_or_update_user


class TestSessionManagement(unittest.TestCase):

    def setUp(self) -> None:
        """ Create valid user and user session """
        super().setUp()
        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('z.z.z', 'test', now())
            """)

        self.test_uuid = str(uuid.uuid4())

        self.user_id = create_or_update_user(
            self.test_uuid,
            "test_user_first_name",
            "test_user_last_name",
            "testsessionmanagement@example.com",
            "male",
            date(2000,1,1),
            'z.z.z',
        )

        self.session_uuid_current = str(uuid.uuid4())
        self.session_uuid_expired = str(uuid.uuid4())

    def tearDown(self) -> None:
        """ Clear up data created only for these tests to ensure compartmentalization """
        super().tearDown()
        with CursorCommit() as curs:
            curs.execute(
                "delete from public.terms_and_conditions where version = 'z.z.z' and terms_text = 'test'"
            )
            curs.execute(
                "delete from public.user_account where email = 'testsessionmanagement@example.com'"
            )

        self._delete_test_sessions()

    def _create_test_sessions(self) -> None:
        with CursorCommit() as curs:
            curs.execute("""
                insert into public.user_session
                    (session_uuid, user_id, device_identifier, device_type, platform, expires_at)
                values
                    (%s, %s, 'test_device_identifier_current', 'test_device_type', 'web', %s),
                    (%s, %s, 'test_device_identifier_expired', 'test_device_type', 'web', %s)
            """,
                (
                    self.session_uuid_current, self.user_id, date(3000, 1, 1),
                    self.session_uuid_expired, self.user_id, datetime.utcnow() - timedelta(hours=1),
                )
            )

    def _delete_test_sessions(self) -> None:
        with CursorCommit() as curs:
            curs.execute(
                """
                delete from public.user_session_history where session_uuid in (
                    select session_uuid from public.user_session where user_id = %s
                )
                """,
                (self.user_id,)
            )
            curs.execute(
                "delete from public.user_session where user_id = %s", (self.user_id,)
            )


    def _get_session(self, columns: str) -> List[Any]:
        with CursorRollback() as curs:
            curs.execute(f"select {columns} from user_session where user_id = %s order by device_identifier desc", (self.user_id,))
            sessions_for_user = curs.fetchall()

        return sessions_for_user

    def _verify_session(self, columns: str, expected_session: List[Any]) -> None:
        sessions_for_user = self._get_session(columns)
        self.assertEqual(sessions_for_user, expected_session)

    def test_prune_sessions(self) -> None:
        self._create_test_sessions()

        # First we have two sessions
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', True),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )

        # Then we prune sessions and are left only with the active session
        _prune_sessions(self.user_id)
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', False),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )

        self._delete_test_sessions()

    def test_extend_session(self) -> None:
        self._create_test_sessions()

        # First we have two sessions
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', True),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )

        # And not user session history
        with CursorRollback() as curs:
            curs.execute(f"select count(*) from public.user_session_history")
            session_history_count = curs.fetchall()[0][0]

        self.assertEqual(session_history_count, 0)

        # And the only expiry is in the year 3000
        session_expiry = self._get_session("expires_at")[1][0]
        self.assertEqual(session_expiry, datetime(3000, 1, 1, 0, 0))

        # Then extending the session will extend from now() plus a default of 1 day
        extend_session(self.session_uuid_current, 'extend for test')
        session_expiry = self._get_session("expires_at")[1][0]

        time_to_expiry = session_expiry - datetime.utcnow()
        day_lower_test_bound = 23 * timedelta(hours=1)
        day_upper_test_bound = 25 * timedelta(hours=1)
        self.assertTrue(day_lower_test_bound < time_to_expiry < day_upper_test_bound)

        # And extending the session by a set number of hours will adhere to that hour-request
        extension_time = 100
        extend_session(self.session_uuid_current, 'extend for test', extend_hours=extension_time)
        session_expiry = self._get_session("expires_at")[1][0]

        time_to_expiry = session_expiry - datetime.utcnow()
        lower_test_bound = (extension_time-1) * timedelta(hours=1)
        upper_test_bound = (extension_time+1) * timedelta(hours=1)
        self.assertTrue(lower_test_bound < time_to_expiry < upper_test_bound)

        # Finally, this user extension history will be logged
        with CursorRollback() as curs:
            curs.execute(f"select session_uuid, count(*) from public.user_session_history group by session_uuid")
            grouped_sessions = curs.fetchall()

        self.assertEqual(grouped_sessions, [(self.session_uuid_current, 2)])

        self._delete_test_sessions()


    def test_create_user_session(self) -> None:
        return
        self._create_test_sessions()

        # First we have two sessions
        # self._verify_session(
        #     "session_uuid, user_id, token, is_active",
        #     [(self.session_uuid_expired, self.user_id, 'test_token_expired', True), (self.session_uuid_current, self.user_id, 'test_token_current', True)]
        # )

        # Then after we create a new session, a new session has been added
        _create_user_session(self.user_id, "some_rando_web_identifier")
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', True),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )

        self._delete_test_sessions()

    # TODO logic for this one is not done
    def test_get_prune_active_sessions(self) -> None:
        return
        self._create_test_sessions()

        # First we have two sessions
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', True),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )

        # Then after we get_prune_active_sessions one of the sessions will be marked inactive & only one active session is returned
        user_sessions = get_prune_active_sessions(self.user_id)
        self._verify_session(
            "session_uuid, user_id, device_identifier, is_active",
            [(self.session_uuid_expired, self.user_id, 'test_device_identifier_expired', False),
             (self.session_uuid_current, self.user_id, 'test_device_identifier_current', True)]
        )
        self.assertEqual(len(user_sessions), 1)

        self._delete_test_sessions()
