from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List
from sockets.manager import manager
from sqlalchemy.orm import Session
from core.database import engine
from models.chat import Room, Message
from models.users import User
from schemas.chat import MessageResponse
from security.auth_security import get_current_user

chat = APIRouter(tags=["chat"])

@chat.get("/rooms/{room_name}/messages", response_model=List[MessageResponse])
async def get_room_messages(room_name: str, current_user: str = Depends(get_current_user)):
    """Obtiene el historial de mensajes de una sala"""
    with Session(engine) as session:
        room = session.query(Room).filter(Room.name == room_name).first()
        if not room:
            return []
            
        messages = session.query(Message).filter(Message.room_id == room.id).order_by(Message.created_at.asc()).all()
        
        # Formateamos la respuesta para incluir el username del que lo envió
        response = []
        for msg in messages:
            response.append({
                "id": msg.id,
                "content": msg.content,
                "created_at": msg.created_at,
                "sender_username": msg.sender.username
            })
            
        return response

@chat.websocket("/ws/{room_name}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_name: str, username: str):
    await manager.connect(websocket, room_name)
    await manager.broadcast(f"El usuario {username} se ha unido a la sala", room_name)
    
    try: 
        while True:
            data = await websocket.receive_text()
            
            # Guardar en base de datos
            with Session(engine) as session:
                # 1. Buscar o crear la sala
                room = session.query(Room).filter(Room.name == room_name).first()
                if not room:
                    room = Room(name=room_name)
                    session.add(room)
                    session.commit()
                    session.refresh(room)
                
                # 2. Buscar al usuario
                user = session.query(User).filter(User.username == username).first()
                
                if user:
                    # 3. Guardar el mensaje
                    new_msg = Message(content=data, user_id=user.id, room_id=room.id)
                    session.add(new_msg)
                    session.commit()
            
            # Retransmitir a todos los conectados
            await manager.broadcast(f"{username}: {data}", room_name)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_name)
        await manager.broadcast(f"El usuario {username} ha abandonado la sala", room_name)

