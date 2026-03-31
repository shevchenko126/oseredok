from datetime import datetime
from pydantic import BaseModel


class EnvelopeCreateSchema(BaseModel):
    building_id: int
    link: str


class EnvelopeUpdateSchema(BaseModel):
    link: str | None = None


class EnvelopeOutSchema(BaseModel):
    id: int
    building_id: int
    link: str
    created_by_id: int | None
    created_at: datetime | None

    class Config:
        orm_mode = True
