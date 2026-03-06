from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from .models import Apartment
from .schemas import ApartmentCreateSchema, ApartmentUpdateSchema


class AppartmentService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: ApartmentCreateSchema) -> Apartment:
        apartment = Apartment(**data.model_dump())
        self.db.add(apartment)
        self.db.commit()
        self.db.refresh(apartment)
        return apartment

    def get_by_id(self, apartment_id: int) -> Apartment:
        apartment = self.db.query(Apartment).filter(Apartment.id == apartment_id).first()
        if not apartment:
            raise HTTPException(status_code=404, detail="Apartment not found")
        return apartment

    def get_list(self, page: int = 1) -> PaginationSchema:
        query = self.db.query(Apartment).filter(Apartment.is_active == True)
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, apartment_id: int, data: ApartmentUpdateSchema) -> Apartment:
        apartment = self.get_by_id(apartment_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(apartment, field, value)
        self.db.commit()
        self.db.refresh(apartment)
        return apartment

    def delete(self, apartment_id: int) -> None:
        apartment = self.get_by_id(apartment_id)
        self.db.delete(apartment)
        self.db.commit()
