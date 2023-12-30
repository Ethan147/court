from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from court.utils import location as loc
from court.utils.db import CursorCommit, CursorRollback


@dataclass
class UserMailingAddress:
    """
        Representation of a user mailing address;
        this is distinct from a play location
    """
    id: int
    user_account_id: int
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    state: str
    country: str
    postal_code: str
    created_at: datetime
    updated_at: datetime
    is_active: bool

@dataclass
class UserPlayLocation:
    """
        Representation of a user play location;
        this is distinct from a user mailing location
    """
    id: int
    user_account_id: int
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    state: str
    country: str
    postal_code: str
    latitude: float
    longitude: float
    created_at: datetime
    updated_at: datetime
    is_active: bool

def find_or_create_user_mailing_address(
    user_account_id: int,
    address_line_1: str,
    address_line_2: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
) -> UserMailingAddress:
    user_mailing_address = find_user_mailing_address(
        user_account_id, address_line_1, address_line_2, city, state, country, postal_code
    )

    if not user_mailing_address:
        user_mailing_address = _insert_user_mailing_address(
            user_account_id, address_line_1, address_line_2, city, state, country, postal_code
        )

    return user_mailing_address

def find_user_mailing_address(
    user_account_id: int,
    address_line_1: str,
    address_line_2: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
    is_active: bool = True
) -> Optional[UserMailingAddress]:
    with CursorRollback() as curs:
        query = """
            select id, user_account_id, address_line_1, address_line_2,
                   city, state, country, postal_code, created_at, updated_at,
                   is_active
              from public.user_mailing_address
             where user_account_id = %s
               and address_line_1 = %s
               and address_line_2 = %s
               and city = %s
               and state = %s
               and country = %s
               and postal_code = %s
               and is_active is %s
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, is_active)
        )
        rows = curs.fetchall()

    if len(rows) > 1:
        raise ValueError("Multiple mailing addresses found")

    if len(rows) == 0:
        return None

    user_mailing_address = rows[0]
    return UserMailingAddress(
        id=user_mailing_address[0],
        user_account_id=user_mailing_address[1],
        address_line_1=user_mailing_address[2],
        address_line_2=user_mailing_address[3],
        city=user_mailing_address[4],
        state=user_mailing_address[5],
        country=user_mailing_address[6],
        postal_code=user_mailing_address[7],
        created_at=user_mailing_address[8],
        updated_at=user_mailing_address[9],
        is_active=user_mailing_address[10]
    )

def _insert_user_mailing_address(
    user_account_id: int,
    address_line_1: str,
    address_line_2: Optional[str],
    city: str,
    state: str,
    country: str,
    postal_code: str,
    ) -> UserMailingAddress:
    with CursorCommit() as curs:
        query = """
            insert into public.user_mailing_address
            (
                user_account_id, address_line_1, address_line_2, city, state, country, postal_code, created_at, is_active
            )
            values (%s, %s, %s, %s, %s, %s, %s, now(), true)
            returning id, created_at, updated_at
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code)
        )
        user_mailing_address_id, created_at, updated_at = curs.fetchall()[0]

    return UserMailingAddress(
        id=user_mailing_address_id,
        user_account_id=user_account_id,
        address_line_1=address_line_1,
        address_line_2=address_line_2,
        city=city,
        state=state,
        country=country,
        postal_code=postal_code,
        created_at=created_at,
        updated_at=updated_at,
        is_active=True
    )

def find_or_create_user_play_location(
    user_account_id: int,
    address_line_1: str,
    address_line_2: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
    latitude: float,
    longitude: float,
    is_active: bool = True
) -> UserPlayLocation:
    user_play_location = find_user_play_location(
        user_account_id, address_line_1, address_line_2,
        city, state, country, postal_code, is_active
    )

    if not user_play_location:
        user_play_location = insert_user_play_location(
            user_account_id, address_line_1, address_line_2,
            city, state, country, postal_code, latitude, longitude, is_active
        )

    return user_play_location

def find_user_play_location(
    user_account_id: int,
    address_line_1: str,
    address_line_2: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
    is_active: bool = True
) -> Optional[UserPlayLocation]:
    with CursorRollback() as curs:
        query = """
            select
                   id,
                   user_account_id,
                   address_line_1,
                   address_line_2,
                   city,
                   state,
                   country,
                   postal_code,
                   ST_Y(location::geometry) AS latitude,
                   ST_X(location::geometry) AS longitude,
                   created_at,
                   updated_at,
                   is_active
              from public.user_play_location
             where user_account_id = %s
               and address_line_1 = %s
               and address_line_2 = %s
               and city = %s
               and state = %s
               and country = %s
               and postal_code = %s
               and is_active is %s
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, is_active)
        )
        rows = curs.fetchall()

    if len(rows) > 1:
        raise ValueError("Multiple user play locations found")

    if len(rows) == 0:
        return None

    user_mailing_address = rows[0]
    return UserPlayLocation(
        id=user_mailing_address[0],
        user_account_id=user_mailing_address[1],
        address_line_1=user_mailing_address[2],
        address_line_2=user_mailing_address[3],
        city=user_mailing_address[4],
        state=user_mailing_address[5],
        country=user_mailing_address[6],
        postal_code=user_mailing_address[7],
        latitude=user_mailing_address[8],
        longitude=user_mailing_address[9],
        created_at=user_mailing_address[10],
        updated_at=user_mailing_address[11],
        is_active=user_mailing_address[12]
    )


def insert_user_play_location(
    user_account_id: int,
    address_line_1: str,
    address_line_2: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
    latitude: float,
    longitude: float,
    is_active: bool = True
) -> UserPlayLocation:
    with CursorCommit() as curs:
        query = """
            insert into public.user_play_location
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, location, created_at, is_active)
            values
            (%s, %s, %s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), now(), %s)
            returning id, created_at, updated_at
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, longitude, latitude, is_active)
        )
        user_play_location_id, created_at, updated_at = curs.fetchall()[0]


    return UserPlayLocation(
        id=user_play_location_id,
        user_account_id=user_account_id,
        address_line_1=address_line_1,
        address_line_2=address_line_2,
        city=city,
        state=state,
        country=country,
        postal_code=postal_code,
        latitude=latitude,
        longitude=longitude,
        created_at=created_at,
        updated_at=updated_at,
        is_active=True
    )
