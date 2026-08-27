from sqlmodel import Session, SQLModel, create_engine

from api.config import settings

from .models import *

sqlite_engine = create_engine(settings.SQLITE_URL, echo=True)
SQLModel.metadata.create_all(sqlite_engine)


def get_session():
    with Session(sqlite_engine) as session:
        yield session
