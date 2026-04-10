from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from uuid import UUID
from fastapi.encoders import jsonable_encoder
from .schemas import UserCreate, UserUpdate, UserResponse
from modules.auth.models import User
from core.constants import PAGE_SIZE
from core.pagination import PaginationSchema, paginate
from core.locales import Locale


class UserService:

    def __init__(self, db:Session, locale: Locale = Locale.EN):
        self.db = db
        self.locale = locale

    def create_user(self, data: UserCreate) -> User:
        print("Creating user with ID:", id)
        user = User(**data.dict())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user(self, user_id: UUID) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def get_user_dict(self, user_id: UUID) -> UserResponse:
        user = self.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        data = jsonable_encoder(UserResponse.model_validate(user, from_attributes=True))
        return data


    def get_users(
            self,
            page:int = 1,
            search:str = None,
        ) -> PaginationSchema:

        users = self.db.query(User)

        if search:
            users = users\
                .filter(
                    or_(
                        User.email.ilike(f"%{search}%"),
                        User.first_name.ilike(f"%{search}%"),
                        User.last_name.ilike(f"%{search}%"),
                    )
                )

        total_count = users.count()

        users = users.order_by(User.created_on.desc())

        if page != -1:
            offset = (page - 1) * PAGE_SIZE
            users = users.limit(PAGE_SIZE).offset(offset)

        users = users.all()
        
        return (users, total_count)


    # def get_cognito_users(
    #         self,
    #         page:int = 1,
    #         search:str = None,
    #     ) -> PaginationSchema:

    #     users = self.cognito.get_users(page, search)
    #     total_count = self.cognito.get_users_count()
    #     response = paginate(page, total_count, users)
    #     return response


    def check_is_user(self, email: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = self.db.query(User).filter(User.username == email).first()

        if not user:
            return False
        return True


    # def get_users_by_ids(self, user_ids: list):
    #     users = self.db.query(User).filter(User.id.in_(user_ids)).all()
    #     return users

    def update_user(self, user_id:UUID, user: UserUpdate ):
        
        db_user = self.db.query(User).filter(User.id == user_id).first()

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        for attr, value in user.dict(exclude_unset=True).items():
            print("attr", attr, value)
            setattr(db_user, attr, value)
                
        self.db.add(db_user)
        self.db.commit()

        return db_user

    # def count_total_users(self):
    #     return self.cognito.get_users_count()
    

    # def register_user(self, user: UserCreate):

    #     password = self._generate_cognito_password(12)

    #     user_signup = UserSignup(
    #         email=user.email,
    #         password=password,
    #         first_name=user.first_name,
    #         last_name=user.last_name
    #     )

    #     user_id = None
        
    #     try:
    #         user_id = self.cognito.user_signup(user_signup)
    #         self.cognito.change_user_role(user_id, user.role)
    #     except botocore.exceptions.ClientError as e:
    #         if e.response["Error"]["Code"] == "UsernameExistsException":
    #             raise HTTPException(status_code=403, detail="User already exists")
    #         else:
    #            raise HTTPException(status_code=403, detail=e)
    #     except Exception as e:
    #         raise HTTPException(status_code=500, detail=e)
        
    #     if not user_id:
    #         raise HTTPException(status_code=500, detail="Internal Server Error")
        
    #     user_create = self.create_user(user_id, user)

    #     notification = AuthNotification(
    #         email=user.email,
    #         title="Registration on Obscure drive",
    #         message="You have been registered on Obscure drive site. Your new password is:",
    #         code=password
    #     )
        
    #     auth_communication = AuthNotificationCommunication()
    #     auth_communication.send_notification(notification)

    #     finance_communication = AuthFinanceCommunication()
    #     finance_communication.get_user_balance(user_id)
        
    #     return user_create


    # def create_user(self, user_id:UUID, user: UserCreate):
    #     user_create = User(
    #         id=user_id,
    #         first_name=user.first_name,
    #         last_name=user.last_name,
    #         email=user.email,
    #         phone=user.phone,
    #         country_id=user.country_id,
    #         city_id=user.city_id,
    #         address=user.address,
    #         comment=user.comment,
    #         manager_id=user.manager_id,
    #     )
    #     self.db.add(user_create)
    #     self.db.commit()
    #     self.db.refresh(user_create)
    #     return user_create


    # def _generate_cognito_password(self, length=8):
    #     if length < 8:
    #         raise ValueError("Password must be at least 8 characters long.")

    #     # Ensure at least one character from each required category
    #     uppercase = secrets.choice(string.ascii_uppercase)
    #     lowercase = secrets.choice(string.ascii_lowercase)
    #     digit = secrets.choice(string.digits)
    #     special = secrets.choice(string.punctuation)

    #     # Fill the remaining length with a mix of all character types
    #     remaining_length = length - 4
    #     all_characters = string.ascii_letters + string.digits + string.punctuation
    #     remaining_chars = ''.join(secrets.choice(all_characters) for _ in range(remaining_length))

    #     # Shuffle to avoid predictable order
    #     password_list = list(uppercase + lowercase + digit + special + remaining_chars)
    #     secrets.SystemRandom().shuffle(password_list)
        
    #     return ''.join(password_list)
    


    # def get_translated_data(self, user: User):
    #     if user.city:
    #         user.city = user.city.translate(self.locale)
    #     if user.country:
    #         user.country = user.country.translate(self.locale)
    #     return user

    # def get_random_staff(self):
    #     accountants = self.db.query(User).filter(User.role == UserRole.ACCOUNTANT).all()
    #     logisticians = self.db.query(User).filter(User.role == UserRole.LOGISTICIAN).all()
    #     expeditors = self.db.query(User).filter(User.role == UserRole.EXPEDITOR).all()
        
    #     return {
    #         'accountant': secrets.choice(accountants).id if accountants else None,
    #         'logistician': secrets.choice(logisticians).id if logisticians else None,
    #         'expeditor': secrets.choice(expeditors).id if expeditors else None
    #     }
    
    # def change_password_by_admin(self, user_id:UUID):
    #     new_password = self._generate_cognito_password()
    #     self.change_password(user_id, new_password)


    #     user = self.db.query(User).filter(User.id == user_id).first()
    #     notification = AuthNotification(
    #         email=user.email,
    #         title="New password on Obscure drive",
    #         message="We changed your password on Obscure drive site. Your new password is:",
    #         code=new_password
    #     )
        
    #     auth_communication = AuthNotificationCommunication()
    #     auth_communication.send_notification(notification)

    #     return {"success": True}
    

    # def change_password_by_admin_to_this(self, user_id:UUID, password:str):
    #     self.change_password(user_id, password)

    #     user = self.db.query(User).filter(User.id == user_id).first()
    #     notification = AuthNotification(
    #         email=user.email,
    #         title="New password on Obscure drive",
    #         message="We changed your password on Obscure drive site. Your new password is:",
    #         code=password
    #     )
        
    #     auth_communication = AuthNotificationCommunication()
    #     auth_communication.send_notification(notification)

    #     return {"success": True}
    
    

    # def change_password(self, user_id:UUID, new_password:str):

    #     try:
    #         response = self.cognito.change_password(new_password, user_id)
    #     except botocore.exceptions.ClientError as e:
    #         if e.response['Error']['Code'] == 'UsernameExistsException':
    #             raise HTTPException(
    #                 status_code=409, detail="An account with the given email already exists")
    #         else:
    #             raise HTTPException(status_code=500, detail="Internal Server")
    #     else:
    #         if 'Error' in response:
    #             raise HTTPException(status_code=401, detail=response['Error'])
    #         return {"success": True}
        
    def get_user_group(self, user_id:UUID):
        user = self.db.query(User).filter(User.id == user_id).first()
        return user.group
    
    def delete_user(self, user_id:UUID):
        db_user = self.db.query(User).filter(User.id == user_id).first()

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        self.db.delete(db_user)
        self.db.commit()