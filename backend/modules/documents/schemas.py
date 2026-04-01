from datetime import datetime
from pydantic import BaseModel


class DocumentCreateSchema(BaseModel):
    building_id: int
    title: str
    file_id: str | None = None


class DocumentUpdateSchema(BaseModel):
    title: str | None = None
    file_id: str | None = None


class DocumentOutSchema(BaseModel):
    id: int
    building_id: int
    title: str
    file_id: str | None
    created_by_id: int | None
    created_at: datetime | None

    class Config:
        orm_mode = True
