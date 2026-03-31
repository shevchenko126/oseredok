from decimal import Decimal
from pydantic import BaseModel


class AccountOutSchema(BaseModel):
    id: int
    appartment_id: int
    balance: Decimal

    class Config:
        orm_mode = True
