import subprocess
import unittest
from unittest.mock import MagicMock, patch

from court.utils.db import Cursor, CursorTest


class TestConnection(unittest.TestCase):

    def test_cursor_connection_classes(self) -> None:

        # Confirm that entered data is accessible
        with CursorTest() as curs:
            curs.execute(
                """
                insert into public.account
                    (first_name, last_name, tennis, pickleball, racquetball)
                values
                    ('first', 'last', true, false, false);
                """
            )
            curs.execute(
                """
                select
                    first_name, last_name, tennis, pickleball, racquetball
                from public.account
                """
                )
            account_entry = curs.fetchall()
            self.assertEqual(
                account_entry,
                [("first", "last", True, False, False)]
            )

        # Confirm that CursorTest data does not persist
        with Cursor() as curs:
            curs.execute('select * from public.account')
            account_entry = curs.fetchall()
            self.assertEqual(account_entry, [])

    @patch('sys.stdout', new_callable=MagicMock)
    def test_dbmate_down_then_up(self, magic_mock:MagicMock) -> None:
        subprocess.run(["dbmate", "down"])
        subprocess.run(["dbmate", "down"])

        # After a full spin-down, only schema_migrations remains
        with CursorTest() as curs:
            curs.execute(
                "select table_name from information_schema.tables where table_schema='public'"
            )
            tables = curs.fetchall()

        self.assertEqual(tables, [('schema_migrations',)])

        subprocess.run(["dbmate", "up"])
        subprocess.run(["dbmate", "up"])


        with CursorTest() as curs:
            curs.execute(
                "select table_name from information_schema.tables where table_schema='public'"
            )
            tables = curs.fetchall()

        self.assertTrue(
            ("schema_migrations",) in tables
        )
        self.assertTrue(
            ("account",) in tables
        )
