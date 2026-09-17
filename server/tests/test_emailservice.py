from email.message import EmailMessage

import pytest

from api.user.email import EmailService


@pytest.mark.anyio
async def test_emailservice_send_console(tmpdir, user_data: dict[str, str]):
    e = EmailService()
    message = EmailMessage()
    message["To"] = "access@dwatlas.org"
    message["From"] = user_data["email"]
    message["Subject"] = f"Request for access from {user_data['full_name']}"
    message.set_content(
        f"{user_data['full_name']}, Organization / Institution: Union / Association\nPurpose: Organizing with my coworkers."
    )
    filepath = tmpdir / "message"
    with open(filepath, "w") as stream:  # noqa
        await e.send_console([message], stream)
    with open(filepath, "r") as f:  # noqa
        assert f.readlines() == [
            "To: access@dwatlas.org\n",
            f"From: {user_data['email']}\n",
            f"Subject: Request for access from {user_data['full_name']}\n",
            'Content-Type: text/plain; charset="utf-8"\n',
            "Content-Transfer-Encoding: 7bit\n",
            "MIME-Version: 1.0\n",
            "\n",
            f"{user_data['full_name']}, Organization / Institution: Union / Association\n",
            "Purpose: Organizing with my coworkers.\n",
            "-" * 79 + "\n",
        ]
