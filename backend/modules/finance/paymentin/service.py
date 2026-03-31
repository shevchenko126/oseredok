from sqlalchemy.orm import Session
from fastapi import HTTPException

from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from modules.auth.models import User
from modules.finance.permissions import check_building_access
from .models import PaymentIn
from .schemas import PaymentInCreateSchema, PaymentInUpdateSchema


class PaymentInService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: PaymentInCreateSchema, user: User) -> PaymentIn:
        check_building_access(self.db, user.id, data.building_id)
        payment = PaymentIn(**data.model_dump(), created_by_id=user.id)
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def get_by_id(self, payment_id: int, user: User) -> PaymentIn:
        payment = self.db.query(PaymentIn).filter(PaymentIn.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentIn not found")
        check_building_access(self.db, user.id, payment.building_id)
        return payment

    def get_list(self, user: User, page: int = 1, building_id: int | None = None) -> PaginationSchema:
        query = self.db.query(PaymentIn)
        if building_id is not None:
            check_building_access(self.db, user.id, building_id)
            query = query.filter(PaymentIn.building_id == building_id)
        else:
            from modules.realestate.building.models import BuildingUser
            accessible_building_ids = (
                self.db.query(BuildingUser.building_id)
                .filter(BuildingUser.user_id == user.id, BuildingUser.is_active == True)
                .subquery()
            )
            query = query.filter(PaymentIn.building_id.in_(accessible_building_ids))
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, payment_id: int, data: PaymentInUpdateSchema, user: User) -> PaymentIn:
        payment = self.db.query(PaymentIn).filter(PaymentIn.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentIn not found")
        check_building_access(self.db, user.id, payment.building_id, require_manager=True)

        was_approved = payment.is_approved
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(payment, field, value)
        self.db.commit()
        self.db.refresh(payment)

        if not was_approved and payment.is_approved:
            self._apply_payment_to_accounts(payment)

        return payment

    def delete(self, payment_id: int, user: User) -> None:
        payment = self.db.query(PaymentIn).filter(PaymentIn.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentIn not found")
        check_building_access(self.db, user.id, payment.building_id, require_manager=True)
        self.db.delete(payment)
        self.db.commit()

    def _apply_payment_to_accounts(self, payment: PaymentIn) -> None:
        from modules.realestate.appartment.models import Apartment
        from modules.finance.account.models import Account

        accounts = (
            self.db.query(Account)
            .join(Apartment, Apartment.id == Account.appartment_id)
            .filter(Apartment.building_id == payment.building_id)
            .all()
        )
        for account in accounts:
            account.balance = account.balance + payment.amount
        self.db.commit()
