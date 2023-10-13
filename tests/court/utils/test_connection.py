import glob
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
                    ('first', 'd1990638-e2e1-4d66-aaaa-424349bfeabd', true, false, false);
                """
            )
            curs.execute(
                """
                select first_name, last_name, tennis, pickleball, racquetball
                from public.account
                where first_name = 'first' and last_name = 'd1990638-e2e1-4d66-aaaa-424349bfeabd'
                """
                )
            account_entry = curs.fetchall()
            self.assertEqual(
                account_entry,
                [("first", "d1990638-e2e1-4d66-aaaa-424349bfeabd", True, False, False)]
            )

        # Confirm that CursorTest data does not persist
        with Cursor() as curs:
            curs.execute(
                """
                select * from public.account
                where first_name = 'first' and last_name = 'd1990638-e2e1-4d66-aaaa-424349bfeabd'
                """
                )
            account_entry = curs.fetchall()
            self.assertEqual(account_entry, [])

    @patch('sys.stdout', new_callable=MagicMock)
    def test_dbmate_down_then_up(self, magic_mock:MagicMock) -> None:
        """Test that dbmate migrations work properly & don't raise errors"""

        def _number_of_migration_files() -> int:
            files = []
            migrations_dir = "db/migrations/*.sql"
            for name in glob.glob(migrations_dir):
                files.append(name)

            return len(files)

        sql_migration_count = _number_of_migration_files()

        for _ in range(sql_migration_count):
            subprocess.run(["dbmate", "down"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

        # After a full spin-down, only schema_migrations remains
        with CursorTest() as curs:
            curs.execute(
                "select table_name from information_schema.tables where table_schema='public'"
            )
            tables = curs.fetchall()

        self.assertEqual(tables, [('schema_migrations',)])

        # After a full spin-up, the account tables exists
        for _ in range(sql_migration_count):
            subprocess.run(["dbmate", "up"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

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
