import datetime

from pydantic import EmailStr
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel


class RequestAccessData(SQLModel):
    name: str
    email: EmailStr
    organization: str
    bio: str


class UserBase(SQLModel):
    username: str | None = Field(index=True, default=None)
    email: EmailStr
    full_name: str | None = None
    disabled: bool | None = None


class UserRoleLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    role_id: int | None = Field(default=None, foreign_key="role.id", primary_key=True)


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
    roles: list["Role"] = Relationship(back_populates="users", link_model=UserRoleLink)


class Role(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("name"),)
    id: int | None = Field(default=None, primary_key=True)
    name: str
    users: list["User"] = Relationship(back_populates="roles", link_model=UserRoleLink)


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


class PasswordUpdateData(SQLModel):
    email: EmailStr
    token: str
    password: str


class PasswordResetData(SQLModel):
    email: EmailStr
