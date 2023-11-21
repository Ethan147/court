import unittest
import uuid
from copy import deepcopy
from datetime import date, datetime, timedelta
from typing import Any, List

from court.utils import location as loc
from court.utils import user
from court.utils.db import CursorCommit, CursorRollback


class TestUserLocationManagement(unittest.TestCase):

    def setUp(self) -> None:
        super().setUp()

        with CursorCommit() as curs:
            curs.execute("""
                insert into public.terms_and_conditions
                    (version, terms_text, created_at)
                values ('t.u.l', 'test', now())
            """)

        test_uuid = str(uuid.uuid4())
        self.user_account_id = user.create_or_update_user(
            cognito_user_id=test_uuid,
            first_name='tet_user_location_management_user',
            last_name='test_last_name',
            email=f"testemail{test_uuid}@example.com",
            gender_category="female",
            date_of_birth=date(2000,1,1),
            terms_consent_version='t.u.l',
        )

        self.address_line_1 = "123 Main St"
        self.address_line_2 = "Apt 4"
        self.city = "Springfield"
        self.state = "IL"
        self.country = "USA"
        self.postal_code = "62704"

    def tearDown(self) -> None:
        super().tearDown()
        with CursorCommit() as curs:
            curs.execute(
                "delete from public.terms_and_conditions where version = 't.u.l' and terms_text = 'test'"
            )
            curs.execute(
                "delete from public.user_account where id = %s", (self.user_account_id,)
            )
            curs.execute("delete from public.user_mailing_address where user_account_id = %s", (self.user_account_id,))

    def test_find_or_create_user_mailing_address(self) -> None:
        # At first, the address will not exist
        found_address = loc.find_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertTrue(found_address is None)

        # An address that does not already exist will be created and will return a reference object
        address = loc.find_or_create_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertIsNotNone(address)
        self.assertEqual(address.user_account_id, self.user_account_id)
        self.assertEqual(address.address_line_1, self.address_line_1)
        self.assertEqual(address.address_line_2, self.address_line_2)
        self.assertEqual(address.city, self.city)
        self.assertEqual(address.state, self.state)
        self.assertEqual(address.country, self.country)
        self.assertEqual(address.postal_code, self.postal_code)

        created_address = deepcopy(address)

        # An address that already exists will be found and will return the same reference object
        found_address = loc.find_or_create_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertEqual(found_address, created_address)

        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_mailing_address where id = %s",
                (address.id,)
            )

    def test_find_and_insert_user_mailing_address(self) -> None:
        # At first, the address will not exist
        found_address = loc.find_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertTrue(found_address is None)

        # When we insert a mailing address, it will then be found
        test_address = loc._insert_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )

        # Test finding the existing user mailing address
        found_address = loc.find_user_mailing_address(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertIsNotNone(found_address)
        self.assertEqual(found_address.id, test_address.id)  # type: ignore
        self.assertEqual(found_address.user_account_id, test_address.user_account_id)  # type: ignore
        self.assertEqual(found_address.address_line_1, test_address.address_line_1)  # type: ignore
        self.assertEqual(found_address.address_line_2, test_address.address_line_2)  # type: ignore
        self.assertEqual(found_address.city, test_address.city)  # type: ignore
        self.assertEqual(found_address.state, test_address.state)  # type: ignore
        self.assertEqual(found_address.country, test_address.country)  # type: ignore
        self.assertEqual(found_address.postal_code, test_address.postal_code)  # type: ignore
        self.assertEqual(found_address.updated_at, test_address.updated_at)  # type: ignore
        self.assertEqual(found_address.created_at, test_address.created_at)  # type: ignore
        self.assertEqual(found_address.is_active, test_address.is_active)  # type: ignore

        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_mailing_address where id = %s",
                (test_address.id,)
            )

    def test_find_user_mailing_address_value_error(self) -> None:
        # Insert two identical addresses for the same user
        with CursorCommit() as curs:
            query = """
                insert into public.user_mailing_address
                (
                    user_account_id, address_line_1, address_line_2, city, state, country, postal_code, created_at, is_active
                )
                values (%s, %s, %s, %s, %s, %s, %s, now(), true),
                    (%s, %s, %s, %s, %s, %s, %s, now(), true);
            """
            values = (
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code,
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code
            )
            curs.execute(query, values)

        # Multiple addresses will lead to a ValueError condition
        with self.assertRaises(ValueError) as context:
            _ = loc.find_user_mailing_address(
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code
            )
            self.assertTrue("Multiple mailing addresses found" in str(context.exception))

        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_mailing_address where user_account_id = %s",
                (self.user_account_id,)
            )

    def test_find_and_insert_user_play_location(self) -> None:
        # No user play location exists at first
        found_location = loc.find_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertIsNone(found_location)

        # Then after we insert it's locatable
        loc.insert_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code,
            39.7817, -89.6501, True
        )
        existing_location = loc.find_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )

        self.assertIsNotNone(existing_location)
        self.assertTrue(bool(existing_location.id))  # type: ignore
        self.assertEqual(existing_location.user_account_id, self.user_account_id)  # type: ignore
        self.assertEqual(existing_location.address_line_1, self.address_line_1)  # type: ignore
        self.assertEqual(existing_location.address_line_2, self.address_line_2)  # type: ignore
        self.assertEqual(existing_location.city, self.city)  # type: ignore
        self.assertEqual(existing_location.state, self.state)  # type: ignore
        self.assertEqual(existing_location.country, self.country)  # type: ignore
        self.assertEqual(existing_location.postal_code, self.postal_code)  # type: ignore
        self.assertEqual(existing_location.latitude, 39.7817)  # type: ignore
        self.assertEqual(existing_location.longitude, -89.6501)  # type: ignore
        self.assertIsNotNone(existing_location.created_at)  # type: ignore
        self.assertIsNotNone(existing_location.updated_at)  # type: ignore
        self.assertEqual(existing_location.is_active, True)  # type: ignore

        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_play_location where id = %s",
                (existing_location.id,)  # type: ignore
            )

    def test_find_or_create_user_play_location(self) -> None:
        # No user play location exists at first
        found_location = loc.find_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code
        )
        self.assertIsNone(found_location)

        # Test that a new play location is created if it does not exist
        new_latitude = 34.0522
        new_longitude = -118.2437
        play_location = loc.find_or_create_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code,
            new_latitude, new_longitude
        )
        self.assertIsNotNone(play_location)
        self.assertTrue(bool(play_location.id))  # type: ignore
        self.assertEqual(play_location.user_account_id, self.user_account_id)  # type: ignore
        self.assertEqual(play_location.address_line_1, self.address_line_1)  # type: ignore
        self.assertEqual(play_location.address_line_2, self.address_line_2)  # type: ignore
        self.assertEqual(play_location.city, self.city)  # type: ignore
        self.assertEqual(play_location.state, self.state)  # type: ignore
        self.assertEqual(play_location.country, self.country)  # type: ignore
        self.assertEqual(play_location.postal_code, self.postal_code)  # type: ignore
        self.assertEqual(play_location.latitude, new_latitude)  # type: ignore
        self.assertEqual(play_location.longitude, new_longitude)  # type: ignore
        self.assertIsNotNone(play_location.created_at)  # type: ignore
        self.assertIsNotNone(play_location.updated_at)  # type: ignore
        self.assertEqual(play_location.is_active, True)  # type: ignore

        # Test that the same play location is returned if it already exists
        same_play_location = loc.find_or_create_user_play_location(
            self.user_account_id, self.address_line_1, self.address_line_2,
            self.city, self.state, self.country, self.postal_code,
            new_latitude, new_longitude
        )
        self.assertEqual(play_location, same_play_location)

        # Cleanup - Delete the created play location
        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_play_location where id = %s",
                (play_location.id,)
            )

    def test_find_user_play_location_value_error(self) -> None:
        # Insert two identical addresses for the same user
        with CursorCommit() as curs:
            query = """
                insert into public.user_play_location
                (
                    user_account_id, address_line_1, address_line_2, city, state, country,
                    postal_code, location, created_at, is_active
                )
                values (%s, %s, %s, %s, %s, %s, %s, ST_GeogFromText('POINT(-89.6501 39.7817)'), now(), true),
                    (%s, %s, %s, %s, %s, %s, %s, ST_GeogFromText('POINT(-89.6501 39.7817)'), now(), true);
            """
            values = (
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code,
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code
            )
            curs.execute(query, values)

        # Multiple addresses will lead to a ValueError condition
        with self.assertRaises(ValueError) as context:
            _ = loc.find_user_play_location(
                self.user_account_id, self.address_line_1, self.address_line_2,
                self.city, self.state, self.country, self.postal_code
            )
            self.assertTrue("Multiple user play locations found" in str(context.exception))

        with CursorCommit() as curs:
            curs.execute(
                "delete from public.user_mailing_address where user_account_id = %s",
                (self.user_account_id,)
            )
