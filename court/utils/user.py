from datetime import date
from typing import Optional

from court.utils.db import CursorCommit

# TODO fill this all out

def create_user(
        cognito_user_id: str,
        first_name: str,
        last_name: str,
        email: str,
        gender_category: str,
        date_of_birth: date,
        terms_consent_version: str,
        gender_self_specify: Optional[str] = None,
) -> None:
    inserted_user_account_id = _insert_user_account(
        cognito_user_id, first_name, last_name, email, gender_category, date_of_birth, gender_self_specify
    )

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
        """
        values = (inserted_user_account_id, terms_consent_version)
        curs.execute(query, values)


def _insert_user_account(
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
                (%s,%s,%s,%s,%s,%s,%s,now())
            returning id
            """
        values = (cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, date_of_birth)
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
