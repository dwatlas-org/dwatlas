from contextlib import asynccontextmanager

import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from api.auth.routes import router as router_auth
from api.config import settings
from api.panel.routes import router as router_panel
from api.user.routes import router as router_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pg_pool = await asyncpg.create_pool(str(settings.POSTGRES_URL))
    yield
    await app.state.pg_pool.close()


app = FastAPI(
    title=settings.PROJECT,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.include_router(router_user)
app.include_router(router_panel)
app.include_router(router_auth)

origins = ["http://localhost:5173", "http://app.dwatlas.org:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    html_content = f"""
    <html>
        <head>
            <title>{settings.PROJECT}</title>
        </head>
        <body>
            <pre>{settings.PROJECT} <sub>v{settings.VERSION}</sub></pre>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/health")
async def health_check():
    try:
        async with app.state.pg_pool.acquire() as connection:
            await connection.fetchval("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except (TimeoutError, asyncpg.PostgresError) as error:
        return {"status": "unhealthy", "database": str(error)}
