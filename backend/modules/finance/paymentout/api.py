from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from core.pagination import PaginationSchema
from db.session import get_db
from modules.auth.api import get_user
from modules.auth.models import User
from .service import PaymentOutService
from .schemas import PaymentOutCreateSchema, PaymentOutUpdateSchema, PaymentOutOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> PaymentOutService:
    return PaymentOutService(db)


@router.post("/", response_model=PaymentOutOutSchema, status_code=201)
def create_payment_out(
    data: PaymentOutCreateSchema,
    user: User = Depends(get_user),
    service: PaymentOutService = Depends(get_service),
):
    return service.create(data, user)


@router.get("/{payment_id}/", response_model=PaymentOutOutSchema)
def get_payment_out(
    payment_id: int,
    user: User = Depends(get_user),
    service: PaymentOutService = Depends(get_service),
):
    return service.get_by_id(payment_id, user)


@router.get("/", response_model=PaginationSchema)
def list_payments_out(
    page: int = 1,
    building_id: int | None = None,
    user: User = Depends(get_user),
    service: PaymentOutService = Depends(get_service),
):
    return service.get_list(user, page, building_id)


@router.patch("/{payment_id}/", response_model=PaymentOutOutSchema)
def update_payment_out(
    payment_id: int,
    data: PaymentOutUpdateSchema,
    user: User = Depends(get_user),
    service: PaymentOutService = Depends(get_service),
):
    return service.update(payment_id, data, user)


@router.delete("/{payment_id}/", status_code=204)
def delete_payment_out(
    payment_id: int,
    user: User = Depends(get_user),
    service: PaymentOutService = Depends(get_service),
):
    service.delete(payment_id, user)
