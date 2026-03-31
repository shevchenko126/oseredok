from sqlalchemy import Column, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class Account(Base):
    id = Column(Integer, primary_key=True, index=True)

    appartment_id = Column(Integer, ForeignKey("apartment.id"), nullable=False, unique=True)
    appartment = relationship("Apartment", backref="account", lazy=True)

    balance = Column(Numeric(12, 2), default=0, nullable=False)
