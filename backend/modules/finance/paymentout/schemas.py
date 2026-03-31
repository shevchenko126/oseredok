from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class PaymentOutCreateSchema(BaseModel):
    building_id: int
    description: str | None = None
    amount: Decimal


class PaymentOutUpdateSchema(BaseModel):
    description: str | None = None
    amount: Decimal | None = None


class PaymentOutOutSchema(BaseModel):
    id: int
    building_id: int
    description: str | None
    amount: Decimal
    created_by_id: int | None
    created_at: datetime | None

    class Config:
        orm_mode = True
