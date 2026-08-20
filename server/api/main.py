from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.user.routes import router as router_user

app = FastAPI()

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


@app.get("/dashboard/{id}")
def dashboard(id: int, name: str | None = None):
    return {"id": id, "name": name}
