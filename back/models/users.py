from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Integer
from core.database import Base

class User(Base):
    __tablename__ = "users"
    id: int = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: str = mapped_column(String(255), nullable=False)
    username: str = mapped_column(String(15), unique=True, nullable=False)
    hashed_password: str = mapped_column(String(255), nullable=False)