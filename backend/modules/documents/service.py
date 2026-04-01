from sqlalchemy.orm import Session
from fastapi import HTTPException

from core.pagination import paginate, PAGE_SIZE, PaginationSchema
from modules.auth.models import User
from modules.finance.permissions import check_building_access
from modules.realestate.building.models import BuildingUser
from .models import Document
from .schemas import DocumentCreateSchema, DocumentUpdateSchema


class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: DocumentCreateSchema, user: User) -> Document:
        check_building_access(self.db, user.id, data.building_id, require_manager=True)
        document = Document(**data.model_dump(), created_by_id=user.id)
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def get_by_id(self, document_id: int, user: User) -> Document:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        check_building_access(self.db, user.id, document.building_id)
        return document

    def get_list(self, user: User, page: int = 1, building_id: int | None = None) -> PaginationSchema:
        query = self.db.query(Document)
        if building_id is not None:
            check_building_access(self.db, user.id, building_id)
            query = query.filter(Document.building_id == building_id)
        else:
            accessible_building_ids = (
                self.db.query(BuildingUser.building_id)
                .filter(BuildingUser.user_id == user.id, BuildingUser.is_active == True)
                .subquery()
            )
            query = query.filter(Document.building_id.in_(accessible_building_ids))
        total = query.count()
        items = query.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
        return paginate(page, total, items)

    def update(self, document_id: int, data: DocumentUpdateSchema, user: User) -> Document:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        check_building_access(self.db, user.id, document.building_id, require_manager=True)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(document, field, value)
        self.db.commit()
        self.db.refresh(document)
        return document

    def delete(self, document_id: int, user: User) -> None:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        check_building_access(self.db, user.id, document.building_id, require_manager=True)
        self.db.delete(document)
        self.db.commit()
