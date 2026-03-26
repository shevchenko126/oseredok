import logging
from datetime import datetime

from fastapi import Depends, HTTPException, APIRouter, BackgroundTasks
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
    UserOutSchema,
    UserAddSchema,
    UserLoginSchema,
    SendConfirmationCodeSchema,
    ConfirmEmailSchema,
    UserUpdateSchema,
)

router = APIRouter()
logger = logging.getLogger(__name__)

def get_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    service = AuthService(db)
    return service.get_user_by_token(token=token)

# def check_admin_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
#     service = AuthService(db)
#     return service.check_user_role(token=token, role=UserRole.ADMIN)


@router.post("/signup/", response_model=UserOutWithTokenSchema, status_code=201)
async def register_user(
    user_in: UserAddSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    user_db = service.register_user(user_in)
    service.generate_and_send_confirmation_code(user_db.email, background_tasks)
    token = create_access_token(sub=str(user_db.id), user_obj=user_db)
    return {"user": UserOutSchema.from_orm(user_db), "token": token}


@router.post("/send-confirmation-code/")
async def send_confirmation_code(
    data: SendConfirmationCodeSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    service.generate_and_send_confirmation_code(data.email, background_tasks)
    return {"success": True}


@router.post("/confirm-email/")
def confirm_email(
    data: ConfirmEmailSchema,
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    service.confirm_email(data.email, data.code)
    return {"success": True}


@router.post("/signin/", response_model=UserOutWithTokenSchema)
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
    return {"user": UserOutSchema.from_orm(user), "token": token}


@router.get("/me/", response_model=UserOutSchema)
def get_me(
    user: User = Depends(get_user),
):
    """Get info about current user."""
    return UserOutSchema.from_orm(user)


@router.patch("/me/", response_model=UserOutSchema)
def patch_me(
    user_in: UserUpdateSchema,
    user: User = Depends(get_user),
    db: Session = Depends(get_db),
):
    """Update current user profile."""
    user_data = user_in.dict(exclude_unset=True)
    for field, value in user_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return UserOutSchema.from_orm(user)
