from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from core.pagination import PaginationSchema
from db.session import get_db
from core.auth import oauth2_scheme
from modules.auth.api import get_user
from modules.auth.models import User
from .service import EnvelopeService
from .schemas import EnvelopeCreateSchema, EnvelopeUpdateSchema, EnvelopeOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> EnvelopeService:
    return EnvelopeService(db)


@router.post("/", response_model=EnvelopeOutSchema, status_code=201)
def create_envelope(
    data: EnvelopeCreateSchema,
    user: User = Depends(get_user),
    service: EnvelopeService = Depends(get_service),
):
    return service.create(data, user)


@router.get("/{envelope_id}/", response_model=EnvelopeOutSchema)
def get_envelope(
    envelope_id: int,
    user: User = Depends(get_user),
    service: EnvelopeService = Depends(get_service),
):
    return service.get_by_id(envelope_id, user)


@router.get("/", response_model=PaginationSchema)
def list_envelopes(
    page: int = 1,
    building_id: int | None = None,
    user: User = Depends(get_user),
    service: EnvelopeService = Depends(get_service),
):
    return service.get_list(user, page, building_id)


@router.patch("/{envelope_id}/", response_model=EnvelopeOutSchema)
def update_envelope(
    envelope_id: int,
    data: EnvelopeUpdateSchema,
    user: User = Depends(get_user),
    service: EnvelopeService = Depends(get_service),
):
    return service.update(envelope_id, data, user)


@router.delete("/{envelope_id}/", status_code=204)
def delete_envelope(
    envelope_id: int,
    user: User = Depends(get_user),
    service: EnvelopeService = Depends(get_service),
):
    service.delete(envelope_id, user)
