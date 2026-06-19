from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
class Base(DeclarativeBase): pass
engine = create_engine(os.getenv("DATABASE_URL"))

