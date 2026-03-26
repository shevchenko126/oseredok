from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, func, Enum as SQLEnum
from enum import Enum
from core.dataclass_sql import dataclass_sql
from db.base_class import Base


@dataclass_sql
class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    avatar_id = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
    is_confirmed = Column(Boolean, default=False)
    email_check_code = Column(String, nullable=True)
    last_login = Column(TIMESTAMP)
    created_on = Column(TIMESTAMP, server_default=func.now())