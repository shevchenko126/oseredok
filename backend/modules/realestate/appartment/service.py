from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from modules.auth.models import User
from .models import Apartment, ApartmentUser
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

    def get_list(self, page: int = 1, user_id: int | None = None) -> PaginationSchema:
        query = self.db.query(Apartment).filter(Apartment.is_active == True)
        if user_id is not None:
            query = query.join(ApartmentUser).filter(ApartmentUser.user_id == user_id)
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

    def get_users(self, apartment_id: int) -> list[User]:
        self.get_by_id(apartment_id)
        return (
            self.db.query(User)
            .join(ApartmentUser, ApartmentUser.user_id == User.id)
            .filter(ApartmentUser.apartment_id == apartment_id)
            .all()
        )

    def add_appartmentuser(self, apartment_id: int, user_id: int, is_owner: bool = False) -> ApartmentUser:
        self.get_by_id(apartment_id)
        apartment_user = ApartmentUser(apartment_id=apartment_id, user_id=user_id, is_owner=is_owner)
        self.db.add(apartment_user)
        self.db.commit()
        self.db.refresh(apartment_user)
        return apartment_user
