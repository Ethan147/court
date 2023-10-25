from datetime import date
from typing import Optional

from court.utils.db import CursorCommit


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
