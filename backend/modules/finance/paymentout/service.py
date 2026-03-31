from sqlalchemy.orm import Session
from fastapi import HTTPException

from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from modules.auth.models import User
from modules.finance.permissions import check_building_access
from .models import PaymentOut
from .schemas import PaymentOutCreateSchema, PaymentOutUpdateSchema


class PaymentOutService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: PaymentOutCreateSchema, user: User) -> PaymentOut:
        check_building_access(self.db, user.id, data.building_id, require_manager=True)
        payment = PaymentOut(**data.model_dump(), created_by_id=user.id)
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def get_by_id(self, payment_id: int, user: User) -> PaymentOut:
        payment = self.db.query(PaymentOut).filter(PaymentOut.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentOut not found")
        check_building_access(self.db, user.id, payment.building_id)
        return payment

    def get_list(self, user: User, page: int = 1, building_id: int | None = None) -> PaginationSchema:
        query = self.db.query(PaymentOut)
        if building_id is not None:
            check_building_access(self.db, user.id, building_id)
            query = query.filter(PaymentOut.building_id == building_id)
        else:
            from modules.realestate.building.models import BuildingUser
            accessible_building_ids = (
                self.db.query(BuildingUser.building_id)
                .filter(BuildingUser.user_id == user.id, BuildingUser.is_active == True)
                .subquery()
            )
            query = query.filter(PaymentOut.building_id.in_(accessible_building_ids))
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, payment_id: int, data: PaymentOutUpdateSchema, user: User) -> PaymentOut:
        payment = self.db.query(PaymentOut).filter(PaymentOut.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentOut not found")
        check_building_access(self.db, user.id, payment.building_id, require_manager=True)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(payment, field, value)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def delete(self, payment_id: int, user: User) -> None:
        payment = self.db.query(PaymentOut).filter(PaymentOut.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="PaymentOut not found")
        check_building_access(self.db, user.id, payment.building_id, require_manager=True)
        self.db.delete(payment)
        self.db.commit()
