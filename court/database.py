import psycopg2

from get_secrets import get_test_pass, get_test_username

conn = psycopg2.connect(
    database="court",
    user=get_test_username(),
    password=get_test_pass(),
    host='127.0.0.2',
    port='5432',
)

conn.autocommit = True

with conn.cursor() as curs:
    curs.execute("select * from information_schema.schemata")
    print(curs.fetchall())
