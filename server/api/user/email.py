from collections.abc import Iterable
from email.message import EmailMessage
from sys import stdout
from typing import IO

import aiosmtplib

from api.config import settings


class EmailService:
    async def send(self, messages: Iterable[EmailMessage]) -> None:
        if settings.EMAIL_PROVIDER == "console":
            return await self.send_console(messages)
        elif settings.EMAIL_PROVIDER == "smtp":
            return await self.send_smtp(messages)
        elif settings.EMAIL_PROVIDER == "mailersend":
            return await self.send_mailersend(messages)
        else:
            raise NotImplementedError("Provider not implemented")

    async def send_console(
        self, messages: Iterable[EmailMessage], stream: IO | None = stdout
    ) -> None:
        for message in messages:
            stream.write(message.as_string())
            stream.write("-" * 79)
            stream.write("\n")

    async def send_mailersend(self, messages: Iterable[EmailMessage]) -> None:
        raise NotImplementedError

    async def send_smtp(self, messages: Iterable[EmailMessage]) -> None:
        for message in messages:
            await aiosmtplib.send(
                message,
                hostname=settings.EMAIL_SMTP_HOST,
                port=settings.EMAIL_SMTP_PORT,
                username=settings.EMAIL_SMTP_USER,
                password=settings.EMAIL_SMTP_PASSWORD,
                start_tls=settings.EMAIL_SMTP_TLS,
                timeout=10,
            )
