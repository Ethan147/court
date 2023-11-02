import datetime
from typing import List

from court.utils.db import CursorCommit, CursorRollback

DEFAULT_SESSION_TIME = 24


def get_prune_active_or_create_session(user_id: int, device_identifier: str) -> str:
    active_sessions = get_prune_active_sessions(user_id)

    if not active_sessions:
        active_session = _create_user_session(user_id, device_identifier)

    return active_session

def _create_user_session(user_id: int, device_identifier: str, session_time: int = DEFAULT_SESSION_TIME) -> str:
    with CursorCommit() as curs:
        query = """
            insert into user_session (user_id, device_identifier, platform, expires_at)
            values (%s, %s, %s, now() + interval '%s hour')
            returning session_uuid;
        """
        curs.execute(query, (user_id, device_identifier, "mobile" if "expo" in device_identifier else "web", session_time))
        session_uuid = curs.fetchone()[0]
        return session_uuid

# TODO: very possible this will need updating. Do we want to subdivide by web/mobile, etc?
def get_prune_active_sessions(user_id: int) -> List[str]:
    _prune_sessions(user_id)

    with CursorRollback() as curs:
        query = "select session_uuid from public.user_session where user_id = %s and is_active is true"
        curs.execute(query, (user_id,))
        user_session_id = curs.fetchall()

    return user_session_id


def extend_session(session_uuid: str, extension_reason: str, extend_hours: int = DEFAULT_SESSION_TIME) -> None:
    """ Extend session & log this in the user session history """
    with CursorCommit() as curs:
        query = """
            update user_session
            set expires_at = now() + interval '%s hour'
            where session_uuid = %s;
        """
        curs.execute(query, (extend_hours, session_uuid,))

        query = """
            insert into user_session_history
                (session_uuid, previous_expires_at, new_expires_at, extension_reason)
            values
                (%s, now(), now() + interval '%s hour', %s);
        """
        curs.execute(query, (session_uuid, extend_hours, extension_reason))


def _prune_sessions(user_id: int) -> None:
    with CursorCommit() as curs:
        query = """
            update user_session
            set is_active = false
            where user_id = %s and expires_at <= now() and is_active = true;
        """
        curs.execute(query, (user_id,))
