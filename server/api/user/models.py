import datetime

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str = Field(index=True)
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = None
    created: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )
    updated: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC),
        sa_column_kwargs={"onupdate": lambda: datetime.datetime.now(datetime.UTC)},
    )
    last_login: datetime.datetime | None = None


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field()


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int


class UserUpdate(SQLModel):
    username: str | None = None
    email: EmailStr | None = None
    full_name: str | None = None
    password: str | None = None
    disabled: bool | None = None
