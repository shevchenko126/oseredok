from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from core.pagination import PaginationSchema
from db.session import get_db
from modules.auth.api import get_user
from modules.auth.models import User
from .service import DocumentService
from .schemas import DocumentCreateSchema, DocumentUpdateSchema, DocumentOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> DocumentService:
    return DocumentService(db)


@router.post("/", response_model=DocumentOutSchema, status_code=201)
def create_document(
    data: DocumentCreateSchema,
    user: User = Depends(get_user),
    service: DocumentService = Depends(get_service),
):
    return service.create(data, user)


@router.get("/{document_id}/", response_model=DocumentOutSchema)
def get_document(
    document_id: int,
    user: User = Depends(get_user),
    service: DocumentService = Depends(get_service),
):
    return service.get_by_id(document_id, user)


@router.get("/", response_model=PaginationSchema)
def list_documents(
    page: int = 1,
    building_id: int | None = None,
    user: User = Depends(get_user),
    service: DocumentService = Depends(get_service),
):
    return service.get_list(user, page, building_id)


@router.patch("/{document_id}/", response_model=DocumentOutSchema)
def update_document(
    document_id: int,
    data: DocumentUpdateSchema,
    user: User = Depends(get_user),
    service: DocumentService = Depends(get_service),
):
    return service.update(document_id, data, user)


@router.delete("/{document_id}/", status_code=204)
def delete_document(
    document_id: int,
    user: User = Depends(get_user),
    service: DocumentService = Depends(get_service),
):
    service.delete(document_id, user)
