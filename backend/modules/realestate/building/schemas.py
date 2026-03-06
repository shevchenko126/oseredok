from pydantic import BaseModel
from datetime import datetime


class BuildingCreateSchema(BaseModel):
    address: str
    city: str
    postal_code: str
    country: str
    description: str | None = None

    class Config:
        orm_mode = True


class BuildingUpdateSchema(BaseModel):
    address: str | None = None
    city: str | None = None
    postal_code: str | None = None
    country: str | None = None
    description: str | None = None
    is_active: bool | None = None

    class Config:
        orm_mode = True


class BuildingOutSchema(BaseModel):
    id: int
    address: str
    city: str
    postal_code: str
    country: str
    description: str | None = None
    is_active: bool
    created_on: datetime | None = None

    class Config:
        orm_mode = True
