from fastapi import FastAPI, Depends
from datetime import datetime
import models
from core.database import Base, engine
from routes.auth import auth
from security.auth_security import get_current_user

app = FastAPI()
Base.metadata.create_all(engine)
app.include_router(auth)

@app.get("/")
async def root():
    return {
        "message": "api de la mensajeria",
        "time": datetime.utcnow()
    }


@app.get("/perfil")
async def perfil(current_user: str = Depends(get_current_user)):
    return {
        "message": f"Hola, {current_user}! Estás autenticado."
    }