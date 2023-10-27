import datetime

from court.utils.db import CursorCommit, CursorRollback


def get_or_create_session(user_id: int, device_identifier: str) -> str:
    with CursorCommit() as curs:
        # Check if there's an active session for this user and device
        query = """
            select session_uuid, expires_at
            from user_session
            where user_id = %s
            and device_identifier = %s
            and is_active = true;
        """
        curs.execute(query, (user_id, device_identifier))
        result = curs.fetchone()

        # If there's an active session, return it
        if result:
            session_uuid, expires_at = result

            # If session is expired, mark it as inactive
            if expires_at <= datetime.utcnow():
                query = """
                UPDATE user_session
                SET is_active = false
                WHERE session_uuid = %s;
                """
                curs.execute(query, (session_uuid,))
                return None
            return session_uuid

        # If no active session, create a new one
        query = """
        INSERT INTO user_session (user_id, device_identifier, platform)
        VALUES (%s, %s, %s)
        RETURNING session_uuid;
        """
        curs.execute(query, (user_id, device_identifier, "mobile" if "expo" in device_identifier else "web"))
        session_uuid = curs.fetchone()[0]
        return session_uuid

# TODO: continue from here. Return one or multiple? Etc.
def get_prune_sessions(user_id: int) -> None:
    _prune_sessions(user_id)

    with CursorRollback as curs:
        query = "select id from public.user_session where user_id = %s"
        curs.execute(query, (user_id,))
        user_session_id = curs.fetchone()[0]

    return user_session_id


def extend_session(session_uuid: str, extension_reason: str, extend_hours: int = 24) -> None:
    """ Extend session & log this in the user session history """
    with CursorCommit() as curs:
        extend_days = extend_hours/24
        query = """
            update user_session
            set expires_at = now() + interval '%s day'
            where session_uuid = %s;
        """
        curs.execute(query, (extend_days, session_uuid,))

        query = """
            insert into user_session_history
                (session_uuid, previous_expires_at, new_expires_at, extension_reason)
            values
                (%s, now(), now() + interval '%s day', %s);
        """
        curs.execute(query, (session_uuid, extend_days, extension_reason))


def _prune_sessions(user_id: int) -> None:
    with CursorCommit() as curs:
        query = """
            update user_session
            set is_active = false
            where user_id = %s and expires_at <= now() and is_active = true;
        """
        curs.execute(query, (user_id,))
