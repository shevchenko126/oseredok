from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from .models import Office
from .schemas import OfficeCreateSchema, OfficeUpdateSchema


class OfficeService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: OfficeCreateSchema) -> Office:
        office = Office(**data.model_dump())
        self.db.add(office)
        self.db.commit()
        self.db.refresh(office)
        return office

    def get_by_id(self, office_id: int) -> Office:
        office = self.db.query(Office).filter(Office.id == office_id).first()
        if not office:
            raise HTTPException(status_code=404, detail="Office not found")
        return office

    def get_list(self, page: int = 1) -> PaginationSchema:
        query = self.db.query(Office).filter(Office.is_active == True)
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, office_id: int, data: OfficeUpdateSchema) -> Office:
        office = self.get_by_id(office_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(office, field, value)
        self.db.commit()
        self.db.refresh(office)
        return office

    def delete(self, office_id: int) -> None:
        office = self.get_by_id(office_id)
        self.db.delete(office)
        self.db.commit()
