from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    username: str

    class Config:
        from_attributes = True
