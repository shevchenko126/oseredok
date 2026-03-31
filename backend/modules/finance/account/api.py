from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from db.session import get_db
from .service import AccountService
from .schemas import AccountOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> AccountService:
    return AccountService(db)


@router.get("/{account_id}/", response_model=AccountOutSchema)
def get_account(
    account_id: int,
    service: AccountService = Depends(get_service),
):
    return service.get_by_id(account_id)


@router.get("/by-appartment/{appartment_id}/", response_model=AccountOutSchema)
def get_account_by_appartment(
    appartment_id: int,
    service: AccountService = Depends(get_service),
):
    return service.get_by_appartment(appartment_id)
