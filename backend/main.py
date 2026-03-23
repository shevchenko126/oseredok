from core.logging import setup_logging


from fastapi import FastAPI
from fastapi_pagination import add_pagination

from core.config import settings
from db.session import engine
from db.base_class import Base
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


setup_logging()

def create_tables():
    Base.metadata.create_all(bind=engine)


def start_application():
    load_dotenv()
    
    app = FastAPI(title=settings.PROJECT_TITLE, version=settings.PROJECT_VERSION)
    from api.router import api_router

    app.include_router(api_router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    add_pagination(app)
    return app


app = start_application()


@app.get("/")
async def root():
    return {"message": "Hello World"}
