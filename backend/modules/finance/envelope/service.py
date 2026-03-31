from sqlalchemy.orm import Session
from fastapi import HTTPException

from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from modules.auth.models import User
from modules.finance.permissions import check_building_access
from .models import Envelope
from .schemas import EnvelopeCreateSchema, EnvelopeUpdateSchema


class EnvelopeService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: EnvelopeCreateSchema, user: User) -> Envelope:
        check_building_access(self.db, user.id, data.building_id, require_manager=True)
        envelope = Envelope(**data.model_dump(), created_by_id=user.id)
        self.db.add(envelope)
        self.db.commit()
        self.db.refresh(envelope)
        return envelope

    def get_by_id(self, envelope_id: int, user: User) -> Envelope:
        envelope = self.db.query(Envelope).filter(Envelope.id == envelope_id).first()
        if not envelope:
            raise HTTPException(status_code=404, detail="Envelope not found")
        check_building_access(self.db, user.id, envelope.building_id)
        return envelope

    def get_list(self, user: User, page: int = 1, building_id: int | None = None) -> PaginationSchema:
        query = self.db.query(Envelope)
        if building_id is not None:
            check_building_access(self.db, user.id, building_id)
            query = query.filter(Envelope.building_id == building_id)
        else:
            from modules.realestate.building.models import BuildingUser
            accessible_building_ids = (
                self.db.query(BuildingUser.building_id)
                .filter(BuildingUser.user_id == user.id, BuildingUser.is_active == True)
                .subquery()
            )
            query = query.filter(Envelope.building_id.in_(accessible_building_ids))
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, envelope_id: int, data: EnvelopeUpdateSchema, user: User) -> Envelope:
        envelope = self.db.query(Envelope).filter(Envelope.id == envelope_id).first()
        if not envelope:
            raise HTTPException(status_code=404, detail="Envelope not found")
        check_building_access(self.db, user.id, envelope.building_id, require_manager=True)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(envelope, field, value)
        self.db.commit()
        self.db.refresh(envelope)
        return envelope

    def delete(self, envelope_id: int, user: User) -> None:
        envelope = self.db.query(Envelope).filter(Envelope.id == envelope_id).first()
        if not envelope:
            raise HTTPException(status_code=404, detail="Envelope not found")
        check_building_access(self.db, user.id, envelope.building_id, require_manager=True)
        self.db.delete(envelope)
        self.db.commit()
