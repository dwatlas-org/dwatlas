import datetime

from pydantic import EmailStr
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    username: str | None = Field(index=True, default=None)
    email: EmailStr
    full_name: str | None = None
    disabled: bool | None = None


class User(UserBase, table=True):
    __table_args__ = (UniqueConstraint("email"),)
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field()
    created: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )
    updated: datetime.datetime | None = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC),
        sa_column_kwargs={"onupdate": lambda: datetime.datetime.now(datetime.UTC)},
    )
    last_login: datetime.datetime | None = None


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int
    created: datetime.datetime
    updated: datetime.datetime
    last_login: datetime.datetime | None = None


class UserUpdate(SQLModel):
    username: str | None = None
    email: EmailStr | None = None
    full_name: str | None = None
    password: str | None = None
    disabled: bool | None = None


class UserSignup(SQLModel):
    email: EmailStr
    password: str
