from fastapi import APIRouter, status, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from db.session import get_db
from fastapi.security import OAuth2PasswordBearer
from modules.users.schemas import UserInfo, UserUpdate
from .service import UserService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)



@router.get('/is-user/', status_code=status.HTTP_200_OK)
async def is_user(
    email: str = Query(..., description="The UUID of the user to check"),
    service:UserService = Depends(get_user_service)
):
    is_user = service.check_is_user(email)
    return {"is_user": is_user}


@router.patch('/{user_id}/', status_code=status.HTTP_200_OK, response_model=UserInfo)
async def change_user(
    user_id: UUID = '',
    user: UserUpdate = '',
    service:UserService = Depends(get_user_service),
):
    user = service.update_user(user_id, user)
    return user


@router.get('/user/{user_id}/', response_model=UserInfo)
async def is_user(
    user_id: UUID = '',
    service:UserService = Depends(get_user_service)
):
#     if not is_access:
        # raise HTTPException(status_code=403, detail="Access forbidden")
    
    user = service.get_user(user_id)
    return user

