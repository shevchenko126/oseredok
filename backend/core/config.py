import logging
import os
from distutils.util import strtobool
from pathlib import Path

from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR.parent / "deploy" / ".env"
load_dotenv(env_path)


class Settings:
    PROJECT_TITLE: str = "Oseredok backend"
    PROJECT_VERSION: str = "0.1"

    POSTGRES_USER: str = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", 5432)
    POSTGRES_DB: str = os.getenv("POSTGRES_DB")
    DATABASE_URL: str = (
        f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    ACCESS_TOKEN_EXPIRE_MINUTES_LONG = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES_LONG")
    )
    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = "HS256"

    NEXT_PUBLIC_BACKEND_URL = os.getenv("NEXT_PUBLIC_BACKEND_URL")
    NEXT_PUBLIC_FRONTEND_URL = os.getenv("NEXT_PUBLIC_FRONTEND_URL")

    SUPPRESS_SENDING_EMAILS = strtobool(os.getenv("SUPPRESS_SENDING_EMAILS", "False"))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")
    MAIL_PORT = int(os.getenv("MAIL_PORT"))
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME")
    MAIL_STARTTLS = strtobool(os.getenv("MAIL_STARTTLS", "False"))
    MAIL_SSL_TLS = strtobool(os.getenv("MAIL_SSL_TLS", "False"))
    MAIL_TLS = strtobool(os.getenv("MAIL_TLS", "True"))
    MAIL_SSL = strtobool(os.getenv("MAIL_SSL", "False"))
    MAIL_USE_CREDENTIALS = strtobool(os.getenv("MAIL_USE_CREDENTIALS", "True"))
    MAIL_VALIDATE_CERTS = strtobool(os.getenv("MAIL_VALIDATE_CERTS", "True"))

    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND")

    API_URL = os.getenv("API_URL")
    BEARER_UUID = os.getenv("BEARER_UUID")

    email_conf = ConnectionConfig(
        MAIL_USERNAME=MAIL_USERNAME,
        MAIL_PASSWORD=MAIL_PASSWORD,
        MAIL_FROM=MAIL_FROM,
        MAIL_PORT=MAIL_PORT,
        MAIL_SERVER=MAIL_SERVER,
        MAIL_FROM_NAME=MAIL_FROM_NAME,
        MAIL_SSL_TLS=MAIL_SSL_TLS,
        USE_CREDENTIALS=MAIL_USE_CREDENTIALS,
        VALIDATE_CERTS=MAIL_VALIDATE_CERTS,
        SUPPRESS_SEND=SUPPRESS_SENDING_EMAILS,
        TEMPLATE_FOLDER=BASE_DIR / "modules" / "notifications" / "templates",
    )

settings = Settings()