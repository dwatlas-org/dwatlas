from collections.abc import Iterable
from email.message import EmailMessage
from sys import stdout
from typing import IO

import aiosmtplib
import httpx

from api.config import settings


class EmailService:
    """Service class grouping different providers for sending emails
    The EMAIL_PROVIDER setting controls which of the private methods is called.

    To add a provider:
        1. Add a private :py:meth:`_send_<new_provider>`
        2. Add the required settings values
        3. Add another if case to the :py:meth:`send` method
    """

    # TODO decide on async vs. sync (threaded) background tasks
    async def send(self, messages: Iterable[EmailMessage]) -> None:
        if settings.EMAIL_PROVIDER == "console":
            await self._send_console(messages)
        elif settings.EMAIL_PROVIDER == "smtp":
            await self._send_smtp(messages)
        elif settings.EMAIL_PROVIDER == "mailersend":
            await self._send_mailersend(messages)
        else:
            raise NotImplementedError("Provider not implemented")

    async def _send_console(
        self, messages: Iterable[EmailMessage], stream: IO | None = stdout
    ) -> None:
        for message in messages:
            stream.write(message.as_string())
            stream.write("-" * 79)
            stream.write("\n")

    async def _send_mailersend(self, messages: Iterable[EmailMessage]) -> None:
        headers = {"Authorization": f"Bearer {settings.EMAIL_MAILERSEND_TOKEN}"}
        for message in messages:
            payload = {
                "from": {"email": message["From"], "name": "MailerSend"},
                "to": [
                    {
                        "email": message["To"],
                    }
                ],
                "subject": message["Subject"],
                "text": message.get_content(),
            }
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    settings.EMAIL_MAILERSEND_ADDRESS, headers=headers, json=payload
                )
                response.raise_for_status()

    async def _send_smtp(self, messages: Iterable[EmailMessage]) -> None:
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
