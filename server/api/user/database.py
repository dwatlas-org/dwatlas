import os

from sqlmodel import create_engine, SQLModel

from .models import *


SQLITE_URL = os.getenv("SQLITE_URL", "sqlite:///:memory:")

sqlite_engine = create_engine(SQLITE_URL, echo=True)
SQLModel.metadata.create_all(sqlite_engine)
