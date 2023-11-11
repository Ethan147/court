from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from court.utils.db import CursorCommit, CursorRollback

"""
todo: should the sign-in API request address at all?
If so, mailing address? play location? both? neither?
"""

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

    create table user_play_location (
        id bigserial primary key,
        user_account_id integer not null references user_account(id) on delete cascade,
        address_line_1 text not null,
        address_line_2 text,
        city text not null,
        state text not null,
        country text not null,
        postal_code text not null,
        location geography(point, 4326), -- WGS 84 SRID
        created_at timestamp not null,
        updated_at timestamp not null default now(),
        is_active boolean not null default true
    );
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
            select id, user_acccount_id, address_line_1, address_line_2,
                   city, state, country, postal_code, created_at, updated_at,
                   is_active
              from public.user_mailing_address
             where user_account_id = %s
               and address_line_1 = %s
               and address_line_2 = %s
               and city = %s
               and state = %s
               and postal_code = %s
               and is_active is %s
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, is_active)
        )
        rows = curs.fetchall()

    if len(rows) > 1:
        raise ValueError("Multiple users found")

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

def find_or_create_user_play_location() -> UserPlayLocation:
    pass

def find_user_play_location() -> Optional[UserPlayLocation]:
    """
    curs.execute(
        "SELECT
            ST_Y(ST_GeographyFromText(ST_AsText(location))) AS latitude,
            ST_X(ST_GeographyFromText(ST_AsText(location))) AS longitude
            FROM user_play_location WHERE id = %s",
            (1,)
    )
    """
    with CursorRollback() as curs:
        query = """
            select

            id, user_acccount_id, address_line_1, address_line_2,
                   city, state, country, postal_code, created_at, updated_at,
                   is_active

    user_account_id, address_line_1, address_line_2, city, state,
    country, postal_code, latitude, longitude, created_at, updated_at,
    is_active


              from public.user_mailing_address
             where user_account_id = %s
               and address_line_1 = %s
               and address_line_2 = %s
               and city = %s
               and state = %s
               and postal_code = %s
               and is_active is %s
        """
        curs.execute(
            query,
            (user_account_id, address_line_1, address_line_2, city, state, country, postal_code, is_active)
        )
        rows = curs.fetchall()

    if len(rows) > 1:
        raise ValueError("Multiple users found")

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
        created_at=user_mailing_address[8],
        updated_at=user_mailing_address[9],
        is_active=user_mailing_address[10]
    )


def insert_user_play_location() -> UserPlayLocation:
    pass
