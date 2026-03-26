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
    avatar_id: str | None = None
    username: str | None = None
    language: str | None = None
    is_email_verified: bool | None = None
    is_active: bool
    created_on: datetime | None = None

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            email=obj.email,
            first_name=obj.first_name,
            last_name=obj.last_name,
            phone=obj.phone,
            avatar_id=obj.avatar_id,
            username=obj.username,
            language=obj.language,
            is_email_verified=getattr(obj, 'is_confirmed', False),
            is_active=obj.is_active,
            created_on=obj.created_on,
        )


class UserOutWithTokenSchema(BaseModel):
    user: UserOutSchema | None = None
    token: str | None = None

    class Config:
        orm_mode = True


class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    avatar_id: str | None = None
    username: str | None = None
    language: str | None = None

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


class SendConfirmationCodeSchema(BaseModel):
    email: EmailStr


class ConfirmEmailSchema(BaseModel):
    email: EmailStr
    code: str