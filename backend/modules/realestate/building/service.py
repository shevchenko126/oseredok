from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from .models import Building
from .schemas import BuildingCreateSchema, BuildingUpdateSchema


class BuildingService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: BuildingCreateSchema) -> Building:
        building = Building(**data.model_dump())
        self.db.add(building)
        self.db.commit()
        self.db.refresh(building)
        return building

    def get_by_id(self, building_id: int) -> Building:
        building = self.db.query(Building).filter(Building.id == building_id).first()
        if not building:
            raise HTTPException(status_code=404, detail="Building not found")
        return building

    def get_list(self, page: int = 1) -> PaginationSchema:
        query = self.db.query(Building).filter(Building.is_active == True)
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, building_id: int, data: BuildingUpdateSchema) -> Building:
        building = self.get_by_id(building_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(building, field, value)
        self.db.commit()
        self.db.refresh(building)
        return building

    def delete(self, building_id: int) -> None:
        building = self.get_by_id(building_id)
        self.db.delete(building)
        self.db.commit()
