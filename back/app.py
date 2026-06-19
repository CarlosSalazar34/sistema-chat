import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import models.users
import models.chat
from core.database import Base, engine
from routes.auth import auth
from security.auth_security import get_current_user
from routes.chat import chat

app = FastAPI()

# Configuración de CORS para permitir que el frontend de React se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambia esto por la URL de tu frontend, ej: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)
app.include_router(auth)
app.include_router(chat)


@app.get("/")
async def root():
    return {
        "message": "api de la mensajeria",
        "time": datetime.utcnow()
    }


@app.get("/perfil")
async def perfil(current_user: str = Depends(get_current_user)):
    return {
        "message": f"Hola, {current_user}! Estás autenticado.",
        "username": current_user
    }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app="app:app", reload=True, port=8000)