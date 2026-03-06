from pydantic import BaseModel


class OfficeCreateSchema(BaseModel):
    title: str
    number: str
    floor: int
    area: int
    building_id: int | None = None

    class Config:
        orm_mode = True


class OfficeUpdateSchema(BaseModel):
    title: str | None = None
    number: str | None = None
    floor: int | None = None
    area: int | None = None
    building_id: int | None = None
    is_active: bool | None = None

    class Config:
        orm_mode = True


class OfficeOutSchema(BaseModel):
    id: int
    title: str
    number: str
    floor: int
    area: int
    building_id: int | None = None
    is_active: bool

    class Config:
        orm_mode = True
