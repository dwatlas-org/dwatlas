from collections.abc import Iterable
from email.message import EmailMessage
from sys import stdout
from typing import IO

from api.config import settings


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
            stream.write(message.as_string())
            stream.write("-" * 79)
            stream.write("\n")

    async def send_mailerlite(self, messages: Iterable[EmailMessage]) -> None:
        raise NotImplementedError
