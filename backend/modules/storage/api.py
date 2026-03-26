import pathlib
import shutil
from typing import Any
from uuid import UUID
from core.auth import oauth2_scheme
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from modules.auth.service import AuthService

from core import config
from db.session import get_db
from modules.auth.models import User
from .schemas import StorageOutSchema
from .models import Storage
from .service import StorageService

# def check_admin_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
#     service = AuthService(db)
#     return service.check_user_roles(token=token, roles=[UserRole.ADMIN, UserRole.MANAGER, UserRole.AUTOMAN])


def get_storage_service(db: Session = Depends(get_db)) -> StorageService:
    return StorageService(db)

router = APIRouter()



@router.post('/', response_model=StorageOutSchema, status_code=201)
def storage_save(
        # su: User = Depends(check_admin_user),
        service: StorageService = Depends(get_storage_service),
        file: UploadFile = File(default=...)):
    """Store files from authenticated users. Admin can set is_public flag."""
    
    resp = service.upload_file(file, True)
    return resp



@router.get('/{uuid}/')
def storage_get(
        uuid: UUID = Path(default=...),
        # su: User = Depends(check_admin_user),
        service: StorageService = Depends(get_storage_service),
    ):
    """Get any uploaded file"""
    
    resp = service.get_file(uuid)
    return resp
