from typing import Literal
from pydantic import BaseModel
from pydantic import EmailStr
from datetime import datetime


class ApartmentCreateSchema(BaseModel):
    number: str
    floor: int
    rooms: int
    area: int
    building_id: int | None = None

    class Config:
        orm_mode = True


class ApartmentUpdateSchema(BaseModel):
    number: str | None = None
    floor: int | None = None
    rooms: int | None = None
    area: int | None = None
    building_id: int | None = None
    is_active: bool | None = None

    class Config:
        orm_mode = True


class ApartmentOutSchema(BaseModel):
    id: int
    number: str
    floor: int
    rooms: int
    area: int
    building_id: int | None = None
    is_active: bool

    class Config:
        orm_mode = True


Action = Literal["is_active"]


class UserActionsSchema(BaseModel):
    user_ids: list[int]
    actions: dict[Action, bool]

    class Config:
        orm_mode = True


class UserChangeEmailSchema(BaseModel):
    new_email: EmailStr
    verification_code: str | None = None

    class Config:
        orm_mode = True