from __future__ import annotations

from typing import Iterable, Sequence, Tuple

from fastapi import Query
from sqlalchemy.orm import Query as SAQuery


def paginate(query: SAQuery, page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100)) -> Tuple[int, Sequence]:
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return total, items
