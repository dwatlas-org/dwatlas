from functools import lru_cache

from pydantic import EmailStr, model_validator
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    BASE_URL: str = "http://localhost:8000"
    PROJECT: str = "DeliveryWorkersAtlas API"
    VERSION: str = "0.1"

    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "database"
    POSTGRES_URL: MultiHostUrl | None = None

    SQLITE_DB_PATH: str = "app.db"
    SQLITE_URL: str | None = None
    AUTH_SECRET_KEY: str | None = None
    AUTH_ALGORITHM: str = "HS256"
    AUTH_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    REQUEST_ACCESS_TO: EmailStr
    REQUEST_ACCESS_FROM: EmailStr

    EMAIL_PROVIDER: str = "console"  # "console" | "smtp" | "mailersend" | ...

    EMAIL_SMTP_USER: str | None = None
    EMAIL_SMTP_PASSWORD: str | None = None
    EMAIL_SMTP_HOST: str | None = None
    EMAIL_SMTP_PORT: int | None = None
    EMAIL_SMTP_TLS: bool = True

    EMAIL_MAILERSEND_ADDRESS: str | None = None
    EMAIL_MAILERSEND_TOKEN: str | None = None

    @model_validator(mode="after")
    def build_db_urls(self) -> "Settings":
        if self.POSTGRES_URL is None:
            self.POSTGRES_URL = MultiHostUrl.build(
                scheme="postgres",
                username=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD,
                host=self.POSTGRES_HOST,
                port=self.POSTGRES_PORT,
                path=self.POSTGRES_DB,
            )

        if self.SQLITE_URL is None:
            self.SQLITE_URL = f"sqlite:///{self.SQLITE_DB_PATH}"

        return self

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() in ["dev", "development", "local"]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in ["prod", "production"]

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT.lower() in ["test", "testing"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
