from typing import Any, Optional

import psycopg2
from psycopg2.extensions import connection, cursor

from court.utils.env_conf import db_host, db_name, db_pass, db_port, db_user


def get_connection() -> connection:
    conn = psycopg2.connect(
      database=db_name,
      user=db_user,
      password=db_pass,
      host=db_host,
      port=db_port,
    )
    return conn


class Cursor:
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
        self.conn.close()


class CursorTest:
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
        self.conn.close()
