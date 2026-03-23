import logging
from datetime import datetime

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm.session import Session

from core.auth import (
    authenticate,
    create_access_token,
    oauth2_scheme,
)
from db.session import get_db

from .service import AuthService
from .models import User
from .schemas import (
    UserOutWithTokenSchema,
    UserAddSchema,
    UserLoginSchema
)

router = APIRouter()
logger = logging.getLogger(__name__)

def get_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    service = AuthService(db)
    return service.get_user_by_token(token=token)

# def check_admin_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
#     service = AuthService(db)
#     return service.check_user_role(token=token, role=UserRole.ADMIN)


@router.post("/register/", response_model=UserOutWithTokenSchema, status_code=201)
async def register_user(
    user_in: UserAddSchema,
    db: Session = Depends(get_db),
    # user: User = Depends(check_admin_user),
):
    service = AuthService(db)
    user_db = service.register_user(user_in)
    token = create_access_token(sub=str(user_db.id), user_obj=user_db)
    return {"user": user_db, "token": token}


@router.post("/login/", response_model=UserOutWithTokenSchema)
def post_login(
    form_data: UserLoginSchema,
    db: Session = Depends(get_db),
):
    user = authenticate(email=form_data.email, password=form_data.password, db=db)
    if not user or not user.is_active:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user.last_login = datetime.now()
    db.commit()

    token = create_access_token(
        sub=str(user.id), remember=form_data.remember, user_obj=user
    )
    return {"user": user, "token": token}


@router.get("/me/", response_model=UserOutWithTokenSchema)
def get_me(
    user: User = Depends(get_user),
    token: str = Depends(oauth2_scheme)
):
    """Get info about current user."""
    return {"user": user, "token": token}



# @router.patch("/{user_id}/", response_model=UserOutWithTokenSchema)
# def patch_change_by_user_id(
#     user_id: int = Path,
#     su: User = Depends(super_user),
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db),
#     user_in: UserUpdateByAdminSchema = Body(...),
# ):
#     """Update user info by admin"""
#     user_data = user_in.dict(exclude_unset=True)

#     if user_data:
#         try:

#             db.query(User).filter(User.id == user_id).update(user_data)
#             db.commit()
#         except IntegrityError:
#             raise HTTPException(
#                 status_code=400, detail="User with this email already exists"
#             )
#     else:
#         raise HTTPException(status_code=400, detail="No data to update")

#     user = db.query(User).filter(User.id == user_id).first()
#     user.token = token
#     return user