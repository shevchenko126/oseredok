from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship

from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class Envelope(Base):
    id = Column(Integer, primary_key=True, index=True)

    building_id = Column(Integer, ForeignKey("building.id"), nullable=False)
    building = relationship("Building", backref="envelopes", lazy=True)

    link = Column(String, nullable=False)

    created_by_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    created_by = relationship("User", backref="envelopes", lazy=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
