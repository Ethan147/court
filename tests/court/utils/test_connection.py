import glob
import subprocess
import unittest
from unittest.mock import MagicMock, patch

from court.utils.db import CursorRollback


class TestConnection(unittest.TestCase):

    def test_cursor_connection_classes(self) -> None:

        # Confirm that entered data is accessible
        with CursorRollback() as curs:
            curs.execute(
                """
                insert into public.user_account
                    (cognito_user_id, first_name, last_name, email, gender_category, dob, created_at)
                values
                    (42, 'first', 'last', 'email@example.com', 'male', '2000-01-01', now());
                """
            )
            curs.execute(
                """
                select first_name, last_name
                from public.user_account
                where first_name = 'first' and last_name = 'last'
                """
                )
            account_entry = curs.fetchall()
            self.assertEqual(
                account_entry,
                [("first", "last")]
            )

        # Confirm that CursorRollback data does not persist
        with CursorRollback() as curs:
            curs.execute(
                """
                select * from public.user_account
                where first_name = 'first' and last_name = 'last'
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
        with CursorRollback() as curs:
            curs.execute(
                "select table_name from information_schema.tables where table_schema='public'"
            )
            tables = curs.fetchall()

        self.assertEqual(tables, [('geography_columns',), ('geometry_columns',), ('spatial_ref_sys',), ('schema_migrations',)])

        # After a full spin-up, the account tables exists
        for _ in range(sql_migration_count):
            subprocess.run(["dbmate", "up"], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

        with CursorRollback() as curs:
            curs.execute(
                "select table_name from information_schema.tables where table_schema='public'"
            )
            tables = curs.fetchall()

        self.assertTrue(
            ("schema_migrations",) in tables
        )
        self.assertTrue(
            ("user_account",) in tables
        )
