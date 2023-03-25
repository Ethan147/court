from typing import Any, Optional

from psycopg2 import pool
from psycopg2.extensions import connection, cursor

from court.utils.env_conf import db_host, db_name, db_pass, db_port, db_user

pool = pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=10,
    database=db_name,
    user=db_user,
    password=db_pass,
    host=db_host,
    port=db_port
)

def get_connection() -> connection:
    return pool.getconn()


class Cursor:
    """Base cursor for use across application"""
    def __init__(self) -> None:
        self.conn = get_connection()

    def __enter__(self) -> cursor:
        return self.conn.cursor()

    def __exit__(
            self,
            exc_type: Optional[Any],
            exc_val: Optional[Any],
            exc_tb: Optional[Any]) -> None:
        self.conn.commit()
        pool.putconn(self.conn)


class CursorTest:
    """Cursor for use by all test cases"""
    def __init__(self) -> None:
        self.conn = get_connection()

    def __enter__(self) -> cursor:
        return self.conn.cursor()

    def __exit__(
            self,
            exc_type: Optional[Any],
            exc_val: Optional[Any],
            exc_tb: Optional[Any]) -> None:
        self.conn.rollback()
        pool.putconn(self.conn)
