"""Generic Alembic revision script."""
from __future__ import annotations

revision = ${repr(revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade() -> None:
% for line in upgrade_ops:
    ${line}
% endfor


def downgrade() -> None:
% for line in downgrade_ops:
    ${line}
% endfor
