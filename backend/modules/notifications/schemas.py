from pydantic import BaseModel
from pydantic import EmailStr


class NotificationAddSchema(BaseModel):
    user_id: int | None = None
    email: EmailStr
    subject: str
    title: str
    text: str
    url: str

    class Config:
        orm_mode = True


class SMSSchema(BaseModel):
    phone: str
    text: str

    class Config:
        orm_mode = True