from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, func, ForeignKey
from enum import Enum
from sqlalchemy.orm import relationship
from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class Apartment(Base):
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    rooms = Column(Integer, nullable=False)
    area = Column(Integer, nullable=False)

    building_id = Column(Integer, ForeignKey("building.id"), nullable=True)
    building = relationship("Building", backref="apartments", lazy=True)

    is_active = Column(Boolean, default=True)
    last_login = Column(TIMESTAMP)
    created_on = Column(TIMESTAMP, server_default=func.now())


@dataclass_sql
class ApartmentUser(Base):
    id = Column(Integer, primary_key=True, index=True)

    apartment_id = Column(Integer, ForeignKey("apartment.id"), nullable=True)
    apartment = relationship("Apartment", backref="apartmentusers", lazy=True)

    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    user = relationship("User", backref="apartmentusers", lazy=True)

    is_owner = Column(Boolean, default=False)

