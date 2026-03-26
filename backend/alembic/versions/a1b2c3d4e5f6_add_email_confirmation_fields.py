"""add email confirmation fields

Revision ID: a1b2c3d4e5f6
Revises: bb004e5bc7f5
Create Date: 2026-03-26 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'bb004e5bc7f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user', sa.Column('is_confirmed', sa.Boolean(), nullable=True, server_default=sa.false()))
    op.add_column('user', sa.Column('email_check_code', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('user', 'email_check_code')
    op.drop_column('user', 'is_confirmed')
