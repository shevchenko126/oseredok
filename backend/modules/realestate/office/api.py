from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from db.session import get_db
from core.pagination import PaginationSchema

from .service import OfficeService
from .schemas import OfficeCreateSchema, OfficeUpdateSchema, OfficeOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> OfficeService:
    return OfficeService(db)


@router.post("/", response_model=OfficeOutSchema, status_code=201)
def create_office(
    data: OfficeCreateSchema,
    service: OfficeService = Depends(get_service),
):
    return service.create(data)


@router.get("/{office_id}/", response_model=OfficeOutSchema)
def get_office(
    office_id: int,
    service: OfficeService = Depends(get_service),
):
    return service.get_by_id(office_id)


@router.get("/", response_model=PaginationSchema)
def list_offices(
    page: int = 1,
    service: OfficeService = Depends(get_service),
):
    return service.get_list(page)


@router.patch("/{office_id}/", response_model=OfficeOutSchema)
def update_office(
    office_id: int,
    data: OfficeUpdateSchema,
    service: OfficeService = Depends(get_service),
):
    return service.update(office_id, data)


@router.delete("/{office_id}/", status_code=204)
def delete_office(
    office_id: int,
    service: OfficeService = Depends(get_service),
):
    service.delete(office_id)
