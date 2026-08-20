import os

from sqlmodel import create_engine, SQLModel


SQLITE_URL = os.getenv("SQLITE_URL", "sqlite:///:memory:")

sqlite_engine = create_engine(SQLITE_URL)
SQLModel.metadata.create_all(sqlite_engine)
