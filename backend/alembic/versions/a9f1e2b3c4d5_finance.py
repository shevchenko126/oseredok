"""finance module

Revision ID: a9f1e2b3c4d5
Revises: 32af352b3dbe
Create Date: 2026-03-31 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a9f1e2b3c4d5'
down_revision: Union[str, None] = '32af352b3dbe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add role column to buildinguser (was defined in model but not migrated)
    op.add_column(
        'buildinguser',
        sa.Column(
            'role',
            sa.Enum(
                'Resident', 'BuildingManager', 'SupportManager', 'Accountant',
                name='building_user_role'
            ),
            nullable=False,
            server_default='Resident',
        )
    )

    # account table
    op.create_table(
        'account',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('appartment_id', sa.Integer(), nullable=False),
        sa.Column('balance', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['appartment_id'], ['apartment.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('appartment_id'),
    )
    op.create_index(op.f('ix_account_id'), 'account', ['id'], unique=False)

    # envelope table
    op.create_table(
        'envelope',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('building_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('link', sa.String(), nullable=False),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['building_id'], ['building.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_envelope_id'), 'envelope', ['id'], unique=False)

    # paymentin table
    op.create_table(
        'paymentin',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('building_id', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['building_id'], ['building.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_paymentin_id'), 'paymentin', ['id'], unique=False)

    # paymentout table
    op.create_table(
        'paymentout',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('building_id', sa.Integer(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('created_by_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['building_id'], ['building.id']),
        sa.ForeignKeyConstraint(['created_by_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_paymentout_id'), 'paymentout', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_paymentout_id'), table_name='paymentout')
    op.drop_table('paymentout')
    op.drop_index(op.f('ix_paymentin_id'), table_name='paymentin')
    op.drop_table('paymentin')
    op.drop_index(op.f('ix_envelope_id'), table_name='envelope')
    op.drop_table('envelope')
    op.drop_index(op.f('ix_account_id'), table_name='account')
    op.drop_table('account')
    op.drop_column('buildinguser', 'role')
    op.execute("DROP TYPE IF EXISTS building_user_role")
