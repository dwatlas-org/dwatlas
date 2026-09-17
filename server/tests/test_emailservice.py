import pytest

from api.user.email import EmailMessage, EmailService


@pytest.mark.anyio
async def test_emailservice_send_console(tmpdir, user_data: dict[str, str]):
    e = EmailService()
    message = EmailMessage(
        address_to="access@dwatlas.org",
        address_from=user_data["email"],
        subject=f"Request for access from {user_data['full_name']}",
        body=f"{user_data['full_name']}, Organization / Institution: Union / Association\nPurpose: Organizing with my coworkers.",
    )
    filepath = tmpdir / "message"
    with open(filepath, "w") as stream:  # noqa
        await e.send_console([message], stream)
    with open(filepath, "r") as f:  # noqa
        assert f.readlines() == [
            "To: access@dwatlas.org\n",
            f"From: {user_data['email']}\n",
            f"Subject: Request for access from {user_data['full_name']}\n",
            f"Body: {user_data['full_name']}, Organization / Institution: Union / Association\n",
            "Purpose: Organizing with my coworkers.\n",
            "-" * 79 + "\n",
        ]
