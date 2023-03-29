from flask import Blueprint

from court.utils.db import Cursor

bp = Blueprint("views", __name__)

@bp.route("/hello")
def hello_world() -> str:
    with Cursor() as curs:
        curs.execute("select * from public.account")
        account_values = curs.fetchall()

        if not account_values:
            curs.execute("""
            insert into public.account
                (first_name, last_name, tennis, pickleball, racquetball)
            values
                ('john', 'tennis', true, false, false);
                        """)

        curs.execute("select * from public.account")
        account_values = curs.fetchall()

    return f"<p>Hello world! Account values: {account_values} </p>"
