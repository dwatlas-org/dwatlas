from sqlmodel import Field, SQLModel
from pydantic import EmailStr


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = None
