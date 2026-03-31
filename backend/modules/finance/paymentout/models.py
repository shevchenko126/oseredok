from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func, Numeric
from sqlalchemy.orm import relationship

from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class PaymentOut(Base):
    id = Column(Integer, primary_key=True, index=True)

    building_id = Column(Integer, ForeignKey("building.id"), nullable=False)
    building = relationship("Building", backref="paymentouts", lazy=True)

    description = Column(String, nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)

    created_by_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    created_by = relationship("User", backref="paymentouts", lazy=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
