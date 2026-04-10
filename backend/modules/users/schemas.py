from enum import Enum
from uuid import UUID
from pydantic import BaseModel, EmailStr, field_validator


class ShortUserInfo(BaseModel):
    id: str | UUID = None
    first_name: str | None = None
    last_name: str | None = None


class UserCreate(BaseModel):
    id: UUID | None = None
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    avatar_id: str | None = None
    username: str | None = None
    is_notifications_enabled: bool | None = None


class UserUpdate(UserCreate):
    pass


class UserInfo(UserCreate):
    id: str | UUID = None
    is_email_verified: bool = False


class UserResponse(UserCreate):
    id: UUID
    is_email_verified: bool | None = None


class AuthNotification(BaseModel):
    email: EmailStr | None = None
    title: str | None = None
    message: str | None = None
    user_id: UUID | None = None
    code: str | None = None

