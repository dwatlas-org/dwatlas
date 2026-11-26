import datetime

import pytest
from factory.alchemy import SQLAlchemyModelFactory
from faker import Faker
from fastapi.testclient import TestClient
from pytest_factoryboy import register
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from api.auth.service import create_access_token
from api.main import app
from api.user.database import get_session
from api.user.models import User

from .factories import RoleFactory, UserFactory

fake = Faker()

BASE_PATH: str = "/api"


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
    app.dependency_overrides[get_session] = lambda: (
        session
    )  # override to use test session
    client = TestClient(app, base_url="http://localhost")
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="user_data", scope="function")
def user_data_fixture(username: str, password: str) -> dict[str, str]:
    email = fake.email()
    full_name = fake.name()
    return {
        "username": username,
        "email": email,
        "full_name": full_name,
        "password": password,
    }


@pytest.fixture(name="password", scope="function")
def password_fixture() -> str:
    password = fake.password(length=8, special_chars=True)
    return password


@pytest.fixture(name="username", scope="function")
def username_fixture() -> str:
    username = fake.first_name()
    return username


@pytest.fixture(name="basepath", scope="function")
def basepath() -> str:
    return BASE_PATH


@pytest.fixture(name="valid_token", scope="function")
def valid_token(user: User) -> str:
    expires_minutes = datetime.timedelta(minutes=15)
    token = create_access_token({"sub": user.email}, expires_minutes)
    return token


@pytest.fixture(name="valid_token_superuser", scope="function")
def valid_token_superuser(superuser: User) -> str:
    expires_minutes = datetime.timedelta(minutes=15)
    token = create_access_token({"sub": superuser.email}, expires_minutes)
    return token


@pytest.fixture(name="superuser", scope="function")
def superuser() -> User:
    role = RoleFactory(name="superuser")
    user = UserFactory(roles=[role])
    return user


register(UserFactory)
register(UserFactory, "second_user")
register(UserFactory, "third_user")

register(RoleFactory)
