from sqlalchemy.orm import Session
from pathlib import Path
import pathlib
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from uuid import uuid4, UUID
from .models import Storage
from core.config import settings



class StorageService:
    def __init__(self, db: Session):
        self.db = db
        self.PATH = settings.BASE_DIR / Path('uploads')
        if not self.PATH.exists():
            self.PATH.mkdir()

    def get_file(self, uuid: UUID):
        try:
            file = self.db.query(Storage).filter(Storage.uuid == uuid).first()
        except ValueError:
            raise HTTPException(status_code=400, detail='Invalid UUID')
        if not file:
            raise HTTPException(status_code=404, detail='UUID not found')
        if file.file_url:
            return RedirectResponse(file.file_url)
        
        if not pathlib.Path(self.PATH / file.filename).exists():
            raise HTTPException(status_code=404, detail='File not found')
        return FileResponse(self.PATH / file.filename, media_type=file.file_type)


    def upload_file(self, file: UploadFile = File(...), is_public: bool = False):
        """Upload file to server and save its metadata in the database."""

        filename = self.get_unique_filenames(file.filename)

        with open(self.PATH / filename, 'wb') as f:
            shutil.copyfileobj(file.file, f)
        file_db = Storage(filename=filename, file_type=file.content_type, is_public=is_public)

        self.db.add(file_db)
        self.db.commit()
        self.db.refresh(file_db)
        return file_db

    def save_file_binary(self, file, filename:str, is_public: bool = False):
        """Upload file to server and save its metadata in the database."""


        filename = self.get_unique_filenames(filename)

        with open(self.PATH / filename, 'wb') as f:
            shutil.copyfileobj(file, f)
        file_db = Storage(filename=filename, file_type="pdf", is_public=is_public)

        self.db.add(file_db)
        self.db.commit()
        self.db.refresh(file_db)
        return file_db


    def get_unique_filenames(self, filename: str) -> tuple[str, str]:
        """Get unique filenames for uploaded file and blurred version of it."""

        path = self.PATH

        while (path / filename).exists():
            uuid_rand = uuid4().hex[:10]
            filename = Path(filename).stem + '_' + uuid_rand + Path(filename).suffix
        return filename
    
    def get_file_path(self, file_id: UUID) -> Path:
        """Get the full path to the file."""
        file = self.db.query(Storage).filter(Storage.uuid == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail='File not found')
        return self.PATH / file.filename