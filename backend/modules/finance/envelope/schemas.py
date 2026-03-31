from datetime import datetime
from pydantic import BaseModel


class EnvelopeCreateSchema(BaseModel):
    building_id: int
    title: str
    link: str


class EnvelopeUpdateSchema(BaseModel):
    title: str | None = None
    link: str | None = None


class EnvelopeOutSchema(BaseModel):
    id: int
    building_id: int
    title: str
    link: str
    created_by_id: int | None
    created_at: datetime | None

    class Config:
        orm_mode = True
