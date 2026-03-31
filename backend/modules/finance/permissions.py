from fastapi import HTTPException
from sqlalchemy.orm import Session

from modules.realestate.building.models import BuildingUser, BuildingUserRole

MANAGER_ROLES = [
    BuildingUserRole.BuildingManager,
    BuildingUserRole.SupportManager,
    BuildingUserRole.Accountant,
]


def check_building_access(db: Session, user_id: int, building_id: int, require_manager: bool = False) -> None:
    query = db.query(BuildingUser).filter(
        BuildingUser.building_id == building_id,
        BuildingUser.user_id == user_id,
        BuildingUser.is_active == True,
    )
    if require_manager:
        query = query.filter(BuildingUser.role.in_(MANAGER_ROLES))
    if not query.first():
        raise HTTPException(status_code=403, detail="Not enough permissions")
