import unittest

from court.utils.db import CursorCommit, CursorRollback
from court.utils.user import create_user


class TestUserUtilities(unittest.TestCase):

    def test_create_user_male(self) -> None:
        create_user(
            'test_uuid',
            'test_first_name',
            'test_last_name'
            'testemail@example.com'
            'male',
            'dob-here',
            'xxx terms consent version'  # todo
        )
