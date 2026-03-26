from pydantic import BaseModel
from pydantic import UUID4


class StorageOutSchema(BaseModel):
    uuid: UUID4
    file_type: str
    filename: str

    class Config:
        orm_mode = True