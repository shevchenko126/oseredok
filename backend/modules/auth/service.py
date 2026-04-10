import random
import logging

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from fastapi_mail import FastMail, MessageSchema, schemas as mail_schemas
from jose import JWTError
from starlette.background import BackgroundTasks

from core.auth import oauth2_scheme, jwt_decode
from core.config import settings
from core.security import get_password_hash
from .models import User
from .schemas import UserAddSchema

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db:Session):
        self.db = db

    def login(self, username: str, password: str) -> bool:
        # Placeholder for actual authentication logic
        return username == "admin" and password == "password"

    def logout(self) -> None:
        # Placeholder for logout logic
        pass

    def get_user_by_token(self, token: str) -> dict:

        if not token:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        try:
            token_data = jwt_decode(token)
        except JWTError as e:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        user = self.db.query(User).filter(User.id == token_data.get("sub")).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        return user


    # def check_user_role(self, token: str, role:UserRole) -> str:

    #     user = self.get_user_by_token(token)

    #     if user.role == UserRole.ADMIN:
    #         return user
    #     if user.role != role:
    #         raise HTTPException(status_code=403, detail="Not enough permissions")
    #     return user


    # def check_user_roles(self, token: str, roles:list[UserRole]) -> str:

    #     user = self.get_user_by_token(token)

    #     if user.role == UserRole.ADMIN:
    #         return user
    #     if not user.role in roles:
    #         raise HTTPException(status_code=403, detail="Not enough permissions")
    #     return user
    

    def register_user(self, user_in: UserAddSchema) -> None:
        
        user = self.db.query(User).filter(User.email == user_in.email).first()

        if user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        create_data = user_in.dict()
        password = create_data.pop("password")
        user_db = User(**create_data)
        user_db.password = get_password_hash(password)
        self.db.add(user_db)
        self.db.commit()
        self.db.refresh(user_db)

        return user_db

    def generate_and_send_confirmation_code(self, email: str, background_tasks: BackgroundTasks) -> None:
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        code = str(random.randint(100000, 999999))
        user.email_check_code = code
        self.db.add(user)
        self.db.commit()

        message = MessageSchema(
            recipients=[email],
            subject="Email confirmation code",
            body=f"Your confirmation code: <b>{code}</b>",
            subtype=mail_schemas.MessageType.html,
        )
        try:
            fm = FastMail(settings.email_conf)
            background_tasks.add_task(fm.send_message, message)
        except Exception as e:
            logger.error(f"Failed to send confirmation email to {email}: {e}")

    def confirm_email(self, email: str, code: str) -> bool:
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if not user.email_check_code or user.email_check_code != code:
            raise HTTPException(status_code=400, detail="Invalid confirmation code")

        user.is_confirmed = True
        user.is_email_verified = True
        user.email_check_code = None
        self.db.add(user)
        self.db.commit()
        return True