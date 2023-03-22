from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text

from get_secrets import get_db_pass, get_local_db_port

DB_NAME = "court"


# For now, support localhost only
def _get_engine(username: str = "postgres") -> Engine:
    _pass = get_db_pass() # type: ignore
    _port = get_local_db_port()
    _connect_str = f"postgresql://{username}:{_pass}@172.17.0.2:{_port}/{DB_NAME}"
    engine = create_engine(_connect_str)
    return engine


Session = sessionmaker(bind=_get_engine())

@contextmanager
def db_session() -> Generator:
    session = Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


with db_session() as session:
    print("preparing to query")
    result = session.execute("select * from information_schema.schemata").fetchall()
    print(result)
