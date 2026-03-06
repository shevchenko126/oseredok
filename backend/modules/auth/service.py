from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from jose import JWTError
from core.auth import oauth2_scheme, jwt_decode
from core.security import get_password_hash
from .models import User, UserRole
from .schemas import UserAddSchema


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


    def check_user_role(self, token: str, role:UserRole) -> str:

        user = self.get_user_by_token(token)

        if user.role == UserRole.ADMIN:
            return user
        if user.role != role:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return user


    def check_user_roles(self, token: str, roles:list[UserRole]) -> str:

        user = self.get_user_by_token(token)

        if user.role == UserRole.ADMIN:
            return user
        if not user.role in roles:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return user
    

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