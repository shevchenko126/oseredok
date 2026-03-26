from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, func, ForeignKey, Enum as SQLEnum
from enum import Enum
from sqlalchemy.orm import relationship
from core.dataclass_sql import dataclass_sql
from db.base_class import Base


class BuildingUserRole(str, Enum):
    Resident = "Resident"
    BuildingManager = "BuildingManager"
    SupportManager = "SupportManager"
    Accountant = "Accountant"


@dataclass_sql
class Building(Base):
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False)
    description = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
    last_login = Column(TIMESTAMP)
    created_on = Column(TIMESTAMP, server_default=func.now())


@dataclass_sql
class BuildingUser(Base):
    id = Column(Integer, primary_key=True, index=True)

    building_id = Column(Integer, ForeignKey("building.id"), nullable=True)
    building = relationship("Building", backref="buildingusers", lazy=True)

    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    user = relationship("User", backref="buildingusers", lazy=True)

    role = Column(
        SQLEnum(BuildingUserRole, name="building_user_role"),
        default=BuildingUserRole.Resident,
        nullable=False,
    )

    is_active = Column(Boolean, default=True)
    last_login = Column(TIMESTAMP)
    created_on = Column(TIMESTAMP, server_default=func.now())


