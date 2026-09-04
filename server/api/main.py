from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import create_async_engine

from api.auth.routes import router as router_auth
from api.config import settings
from api.panel.routes import router as router_panel
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
    title=settings.PROJECT,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.include_router(router_user)
app.include_router(router_auth)
app.include_router(router_panel)
app.include_router(router_auth)

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
    html_content = """
    <html>
        <head>
            <title>{settings.PROJECT}</title>
        </head>
        <body>
            <pre>{settings.PROJECT} v{settings.VERSION}</pre>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)
