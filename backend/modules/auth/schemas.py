from typing import Literal
from pydantic import BaseModel
from pydantic import EmailStr
from datetime import datetime


class BaseUser(BaseModel):
    email: str

    class Config:
        orm_mode = True


class UserAddSchema(BaseUser):
    password: str

    class Config:
        orm_mode = True


class UserOutSchema(BaseUser):
    id: int
    email: str
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    is_active: bool
    created_on: datetime | None = None

    class Config:
        orm_mode = True


class UserOutWithTokenSchema(BaseModel):
    user: UserOutSchema | None = None
    token: str | None = None

    class Config:
        orm_mode = True


class UserOutWithTokenSchemaResp(BaseModel):
    success: bool
    user: UserOutWithTokenSchema

    class Config:
        orm_mode = True


class UserLoginSchema(BaseUser):
    password: str
    remember: bool = False



class UserOutInfoWithTokenSchema(UserOutWithTokenSchema):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    new_identity_confirmation_code: str | None = None

    class Config:
        orm_mode = True


class UserOutInfoSchema(UserOutSchema):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None

    class Config:
        orm_mode = True


class UserUpdateInfoConfirmSchema(BaseModel):
    email: str | None = None
    phone: str | None = None
    code: str = ""


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