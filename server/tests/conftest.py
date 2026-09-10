import pytest
from factory.alchemy import SQLAlchemyModelFactory
from fastapi.testclient import TestClient
from pytest_factoryboy import register
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from api.main import app
from api.user.database import get_session

from .factories import UserFactory


@pytest.fixture(name="session", scope="function", autouse=True)
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # This is a hack I found to make the factories use the right session object
        for factory in SQLAlchemyModelFactory.__subclasses__():
            factory._meta.sqlalchemy_session = session
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


register(UserFactory)
register(UserFactory, "second_user")
register(UserFactory, "third_user")
