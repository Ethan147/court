import os

# database configurations
db_name = os.environ.get("DB_NAME")
db_host = os.environ.get('DB_HOST')
db_port = int(os.environ.get("DB_PORT"))  # type: ignore
db_pass = os.environ.get("DB_PASS")
db_user = os.environ.get("DB_USER")
