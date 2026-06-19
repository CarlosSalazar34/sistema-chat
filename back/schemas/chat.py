from pydantic import BaseModel
from datetime import datetime
from typing import List

class MessageResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    sender_username: str  # Extraemos el nombre de usuario del sender

    class Config:
        from_attributes = True

class RoomResponse(BaseModel):
    name: str
    
    class Config:
        from_attributes = True
