"""Use email as unique identifier (username becomes optional)

Revision ID: bf1ab73f34b2
Revises: b12e174e667e
Create Date: 2026-09-08 14:46:04.882194

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "bf1ab73f34b2"
down_revision: str | Sequence[str] | None = "b12e174e667e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # Set email to default value (username@example.com) if currently null
    table_user = sa.sql.table(
        "user", sa.Column("email", sa.VARCHAR()), sa.Column("username", sa.VARCHAR())
    )
    op.execute(
        table_user.update()
        .where(table_user.c.email.is_(None))
        .values(email=table_user.c.username + "@example.com")
    )
    with op.batch_alter_table("user") as batch_op:
        batch_op.drop_constraint("uq_username")
        batch_op.create_unique_constraint("uq_email", ["email"])
        batch_op.alter_column("email", nullable=False)
        batch_op.alter_column("username", nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("user") as batch_op:
        batch_op.create_unique_constraint("uq_username", ["username"])
        batch_op.drop_constraint("uq_email")
        batch_op.alter_column("email", nullable=True)
        batch_op.alter_column("username", nullable=False)
