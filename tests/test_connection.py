import unittest

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
