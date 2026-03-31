from typing import Literal
from pydantic import BaseModel
from pydantic import EmailStr
from datetime import datetime
from modules.realestate.building.models import BuildingUserRole
from modules.realestate.building.schemas import BuildingOutSchema


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
    role: BuildingUserRole | None = None
    building: BuildingOutSchema | None = None

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        building, role = cls._get_building_and_role(obj)
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
            role=role,
            building=building,
        )

    @staticmethod
    def _get_building_and_role(obj):
        building_users_raw = getattr(obj, "buildingusers", None)
        building_users = list(building_users_raw) if building_users_raw else []
        if not building_users:
            return None, None

        building_user = next(
            (bu for bu in building_users if getattr(bu, "building", None)),
            building_users[0],
        )
        if not building_user:
            return None, None

        building = (
            BuildingOutSchema.from_orm(building_user.building)
            if getattr(building_user, "building", None)
            else None
        )

        raw_role = getattr(building_user, "role", None)
        role = BuildingUserRole(raw_role) if raw_role else None

        return building, role


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


class SetupBuildingSchema(BaseModel):
    building_id: int
    apartment_id: int
    is_owner: bool = False
