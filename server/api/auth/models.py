from pydantic import EmailStr
from sqlmodel import SQLModel


class TokenData(SQLModel):
    email: EmailStr | None = None


class LoginData(SQLModel):
    email: EmailStr
    password: str
    remember: bool | None = False
