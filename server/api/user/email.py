from collections.abc import Iterable
from sys import stdout
from typing import IO

from pydantic import BaseModel, EmailStr

from api.config import settings


class EmailMessage(BaseModel):
    address_to: EmailStr
    address_from: EmailStr
    subject: str | None
    body: str


class EmailService:
    async def send(self, messages: Iterable[EmailMessage]) -> None:
        if settings.EMAIL_PROVIDER == "console":
            return await self.send_console(messages)
        else:
            raise NotImplementedError("Provider not implemented")

    async def send_console(
        self, messages: Iterable[EmailMessage], stream: IO | None = stdout
    ) -> None:
        for message in messages:
            stream.write(f"To: {message.address_to}\n")
            stream.write(f"From: {message.address_from}\n")
            stream.write(f"Subject: {message.subject}\n")
            stream.write(f"Body: {message.body}\n")
            stream.write("-" * 79)
            stream.write("\n")

    async def send_mailerlite(self, messages: Iterable[EmailMessage]) -> None:
        raise NotImplementedError
