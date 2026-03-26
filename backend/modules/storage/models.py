import sqlalchemy
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class Storage(Base):
    uuid = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=sqlalchemy.text("gen_random_uuid()"),
    )
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_url = Column(String, nullable=True)
    is_public = Column(String, nullable=True)
    is_active = Column(String, nullable=True)
