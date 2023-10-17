import unittest

from court.utils.db import CursorCommit, CursorRollback
from court.utils.validation import (validate_address, validate_age,
                                    validate_birthdate, validate_email,
                                    validate_gender, validate_name,
                                    validate_password, validate_terms_accepted)


class TestValidationFunctions(unittest.TestCase):

    def setUp(self) -> None:
        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('x.x.x', 'test', now())
            """)

    def tearDown(self) -> None:
        with CursorCommit() as curs:
            curs.execute("""
                delete from public.terms_and_conditions
                where version = 'x.x.x' and terms_text = 'test'
            """)

    def test_validate_name(self) -> None:
        self.assertTrue(validate_name("John"))
        self.assertFalse(validate_name("John1"))
        self.assertFalse(validate_name(""))

    def test_validate_email(self) -> None:
        self.assertTrue(validate_email("john@example.com"))
        self.assertFalse(validate_email("john.example.com"))
        self.assertFalse(validate_email(""))

    def test_validate_password(self) -> None:
        self.assertTrue(validate_password("Abc$1234"))
        self.assertFalse(validate_password("abc123"))
        self.assertFalse(validate_password("Abc123"))
        self.assertFalse(validate_password(""))

    def test_validate_gender(self) -> None:
        self.assertTrue(validate_gender("male"))
        self.assertTrue(validate_gender("female"))
        self.assertTrue(validate_gender("other"))
        self.assertFalse(validate_gender("abc"))

    def test_validate_age(self) -> None:
        self.assertTrue(validate_age(17))
        self.assertFalse(validate_age(15))

    def test_validate_birthdate(self) -> None:
        """ should be mm/dd/yyyy """
        self.assertTrue(validate_birthdate(f"01/01/1990"))
        self.assertFalse(validate_birthdate(f"1990/01/01"))

    def test_validate_address(self) -> None:
        self.assertTrue(validate_address("123 Main St"))
        self.assertFalse(validate_address(123))  # type: ignore

    def test_validate_terms_accepted(self) -> None:
        self.assertTrue(validate_terms_accepted('x.x.x'))
        self.assertFalse(validate_terms_accepted('anything else'))
