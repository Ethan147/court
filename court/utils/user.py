from typing import Optional

from court.utils.db import CursorCommit

# TODO fill this all out

def create_user(
        cognito_user_id: str,
        first_name: str,
        last_name: str,
        email: str,
        gender_category: str,
        date_of_birth: str,
        terms_consent_version: str,
        gender_self_specify: Optional[str] = None,
) -> None:

    with CursorCommit() as curs:
        # Create new user account
        query = """
            insert into public.user_account
                (cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, dob, created_at)
            values
                (%s,%s,%s,%s,%s,%s,%s,now())
            returning id
            """
        values = (cognito_user_id, first_name, last_name, email, gender_category, gender_self_specify, date_of_birth)
        curs.execute(query, values)
        inserted_id = curs.fetchone()[0]


def _insert_user_account():
    pass

def _insert_terms_and_conditions():
    pass
