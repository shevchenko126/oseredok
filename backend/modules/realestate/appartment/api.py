from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from db.session import get_db
from core.pagination import PaginationSchema

from .service import AppartmentService
from .schemas import ApartmentCreateSchema, ApartmentUpdateSchema, ApartmentOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> AppartmentService:
    return AppartmentService(db)


@router.post("/", response_model=ApartmentOutSchema, status_code=201)
def create_apartment(
    data: ApartmentCreateSchema,
    service: AppartmentService = Depends(get_service),
):
    return service.create(data)


@router.get("/{apartment_id}/", response_model=ApartmentOutSchema)
def get_apartment(
    apartment_id: int,
    service: AppartmentService = Depends(get_service),
):
    return service.get_by_id(apartment_id)


@router.get("/", response_model=PaginationSchema)
def list_apartments(
    page: int = 1,
    user_id: int | None = None,
    service: AppartmentService = Depends(get_service),
):
    return service.get_list(page, user_id)


@router.patch("/{apartment_id}/", response_model=ApartmentOutSchema)
def update_apartment(
    apartment_id: int,
    data: ApartmentUpdateSchema,
    service: AppartmentService = Depends(get_service),
):
    return service.update(apartment_id, data)


@router.delete("/{apartment_id}/", status_code=204)
def delete_apartment(
    apartment_id: int,
    service: AppartmentService = Depends(get_service),
):
    service.delete(apartment_id)
