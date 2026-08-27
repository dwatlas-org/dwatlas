from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine

from api.config import settings
from api.user.routes import router as router_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    postgres_engine = create_async_engine(str(settings.POSTGRES_URL))
    # sqlite_engine = create_async_engine(
    #     settings.SQLITE_URL,
    #     connect_args={"check_same_thread": False},
    # )

    yield

    await postgres_engine.dispose()
    # await sqlite_engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.include_router(router_user)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/panels/{id}")
def panels(id: str, filters: dict | None = None):
    return {"id": id, "filters": filters}
