from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional

from court.utils.db import CursorCommit, CursorRollback


@dataclass
class UserAccount:
    """Representation of a user account"""
    id: int
    user_uuid: str
    cognito_user_id: str
    first_name: str
    last_name: str
    email: str
    gender_category: str
    gender_self_specify: Optional[str]
    dob: date
    created_at: datetime
    updated_at: datetime


def find_user(
        user_uuid: Optional[str] = None,
        cognito_user_id: Optional[str] = None,
        email: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        dob: Optional[date] = None
    ) -> Optional[UserAccount]:

    def _strategy(
        user_uuid: Optional[str] = None,
        cognito_user_id: Optional[str] = None,
        email: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        dob: Optional[date] = None) -> Optional[str]:
        if user_uuid:
            return "user_uuid"
        elif cognito_user_id:
            return "cognito_user_id"
        elif email:
            return "email"
        elif first_name and last_name and dob:
            return "name_dob"
        else:
            return None

    select_criteria = "id,user_uuid,cognito_user_id,first_name,last_name,email,gender_category,gender_self_specify,dob,created_at,updated_at"
    find_user_query, params = {
        "user_uuid": (f"select {select_criteria} from public.user_account where user_uuid = %s", (user_uuid,)),
        "cognito_user_id": (f"select {select_criteria} from public.user_account where cognito_user_id = %s", (cognito_user_id,)),
        "email": (f"select {select_criteria} from public.user_account where email = %s", (email,)),
        "name_dob": (f"select {select_criteria} from public.user_account where first_name = %s and last_name = %s and dob = %s", (first_name, last_name, dob),),
        None: ("",""),
    }[
        _strategy(user_uuid, cognito_user_id, email, first_name, last_name, dob)
    ]

    if not find_user_query:
        return None

    with CursorRollback() as curs:
        curs.execute(find_user_query, params)
        rows = curs.fetchall()

    if len(rows) > 1:
        raise ValueError("Multiple users found")

    if len(rows) == 0:
        return None

    user = rows[0]
    return UserAccount(
        id=user[0],
        user_uuid=user[1],
        cognito_user_id=user[2],
        first_name=user[3],
        last_name=user[4],
        email=user[5],
        gender_category=user[6],
        gender_self_specify=user[7],
        dob=user[8],
        created_at=user[9],
        updated_at=user[10],
    )


def create_or_update_user(
        cognito_user_id: str,
        first_name: str,
        last_name: str,
        email: str,
        gender_category: str,
        date_of_birth: date,
        terms_consent_version: str,
        gender_self_specify: Optional[str] = None,
) -> int:
    """
    If email already exists, update that user account
    """
    inserted_user_account_id = _upsert_user_account(
        cognito_user_id, first_name, last_name, email, gender_category, date_of_birth, gender_self_specify
    )
    _insert_terms_and_conditions(inserted_user_account_id, terms_consent_version)

    return inserted_user_account_id

def _upsert_user_account(
        cognito_user_id: str,
        first_name: str,
        last_name: str,
        email: str,
        gender_category: str,
        date_of_birth: date,
        gender_self_specify: Optional[str] = None,) -> int:
    with CursorCommit() as curs:
        query = """

            insert into public.user_account
                (cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, dob, created_at)
            values
                (%s, %s, %s, %s, %s, %s, %s, now())
            on conflict (email)
            do update
            set
                cognito_user_id = %s,
                first_name = %s,
                last_name = %s,
                email = %s,
                gender_category = %s,
                gender_self_specify = %s,
                dob = %s
            returning id;

            """
        values = (
            cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, date_of_birth,
            cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, date_of_birth,
            )
        curs.execute(query, values)
        inserted_user_account_id = curs.fetchone()[0]

    return inserted_user_account_id

def _insert_terms_and_conditions(
        user_account_id: int,
        terms_consent_version: str,
        ) -> int:

    with CursorCommit() as curs:
        query = """
            insert into public.user_account_terms_consent
                (user_account_id, terms_and_conditions_id, consented_at, created_at)
            values
                (
                    %s,
                    (select id from public.terms_and_conditions where version = %s),
                    now(),
                    now()
                )
            returning id
        """
        values = (user_account_id, terms_consent_version)
        curs.execute(query, values)
        inserted_user_account_terms_consent_id = curs.fetchone()[0]

    return inserted_user_account_terms_consent_id
