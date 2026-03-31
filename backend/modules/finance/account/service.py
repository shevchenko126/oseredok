from sqlalchemy.orm import Session
from fastapi import HTTPException

from .models import Account


class AccountService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, account_id: int) -> Account:
        account = self.db.query(Account).filter(Account.id == account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
        return account

    def get_by_appartment(self, appartment_id: int) -> Account:
        account = self.db.query(Account).filter(Account.appartment_id == appartment_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
        return account

    def create_for_appartment(self, appartment_id: int) -> Account:
        account = Account(appartment_id=appartment_id, balance=0)
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account
