from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class PaymentInCreateSchema(BaseModel):
    building_id: int
    description: str | None = None
    amount: Decimal


class PaymentInUpdateSchema(BaseModel):
    description: str | None = None
    amount: Decimal | None = None
    is_approved: bool | None = None


class PaymentInOutSchema(BaseModel):
    id: int
    building_id: int
    description: str | None
    amount: Decimal
    is_approved: bool
    created_by_id: int | None
    created_at: datetime | None

    class Config:
        orm_mode = True
