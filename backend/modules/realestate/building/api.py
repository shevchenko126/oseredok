from fastapi import Depends, APIRouter
from sqlalchemy.orm.session import Session

from db.session import get_db
from core.pagination import PaginationSchema

from .service import BuildingService
from .schemas import BuildingCreateSchema, BuildingUpdateSchema, BuildingOutSchema

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> BuildingService:
    return BuildingService(db)


@router.post("/", response_model=BuildingOutSchema, status_code=201)
def create_building(
    data: BuildingCreateSchema,
    service: BuildingService = Depends(get_service),
):
    return service.create(data)


@router.get("/{building_id}/", response_model=BuildingOutSchema)
def get_building(
    building_id: int,
    service: BuildingService = Depends(get_service),
):
    return service.get_by_id(building_id)


@router.get("/", response_model=PaginationSchema)
def list_buildings(
    page: int = 1,
    service: BuildingService = Depends(get_service),
):
    return service.get_list(page)


@router.patch("/{building_id}/", response_model=BuildingOutSchema)
def update_building(
    building_id: int,
    data: BuildingUpdateSchema,
    service: BuildingService = Depends(get_service),
):
    return service.update(building_id, data)


@router.delete("/{building_id}/", status_code=204)
def delete_building(
    building_id: int,
    service: BuildingService = Depends(get_service),
):
    service.delete(building_id)
