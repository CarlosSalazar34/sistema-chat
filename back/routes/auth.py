from fastapi import HTTPException
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from security.auth_security import get_token, verify_token
from sqlalchemy.orm import Session
from core.database import engine
from models.users import User
from schemas.user import UserRegister, UserResponse

auth = APIRouter(tags=["oauth-endpoints"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@auth.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.query(User).filter(User.username == form_data.username).first()
        if not user: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        is_password_valid = pwd_context.verify(form_data.password, user.hashed_password)
        if not is_password_valid: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token = get_token({
            "username": user.username,
            "id": user.id,
            "name": user.name,
        })
        return {"access_token": token, "token_type": "bearer"}


@auth.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    with Session(engine) as session:
        # Verificar si el usuario ya existe
        existing_user = session.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está en uso"
            )
        
        # Encriptar contraseña y crear usuario
        hashed_password = pwd_context.hash(user_data.password)
        new_user = User(
            name=user_data.name,
            username=user_data.username,
            hashed_password=hashed_password
        )
        
        # Guardar en base de datos
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        return new_user

        
