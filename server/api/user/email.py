from collections.abc import Iterable
from email.message import EmailMessage
from sys import stdout
from typing import IO

import aiosmtplib
import httpx

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
                r = await client.post(
                    settings.EMAIL_MAILERSEND_ADDRESS, headers=headers, json=payload
                )
                r.raise_for_status()
                return {"status": r.status_code}

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
