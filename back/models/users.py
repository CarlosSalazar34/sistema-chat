from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from core.database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    username: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)