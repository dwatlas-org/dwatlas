import os

from sqlmodel import Session, SQLModel, create_engine

from .models import *

SQLITE_URL = os.getenv("SQLITE_URL", "sqlite:///:memory:")

sqlite_engine = create_engine(SQLITE_URL, echo=True)
SQLModel.metadata.create_all(sqlite_engine)


def get_session():
    with Session(sqlite_engine) as session:
        yield session
