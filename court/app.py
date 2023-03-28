from flask import Flask

from court.utils.db import Cursor

app = Flask(__name__)

# TODO: remove once basic concept (serving data, unit tests) is proven-out
@app.route("/hello")
def hello_world():

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
