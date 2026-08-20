from sqlmodel import Field, SQLModel
from pydantic import EmailStr


class UserBase(SQLModel):
    username: str = Field(index=True)
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = None


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field()


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int
