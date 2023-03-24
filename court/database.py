import psycopg2
from env_configuration import db_host, db_name, db_pass, db_port, db_user

conn = psycopg2.connect(
    database=db_name,
    user=db_user,
    password=db_pass,
    host=db_host,
    port=db_port,
)

conn.autocommit = True

with conn.cursor() as curs:
    curs.execute("select * from public.account")
    print(curs.fetchall())
