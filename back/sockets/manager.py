from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager: 
    def __init__(self): 
        # Diccionario para guardar listas de websockets separados por sala
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    # Añadimos room_id para saber a qué sala se está conectando
    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        # Si la sala no existe en nuestro diccionario, la creamos con una lista vacía
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
            
        # Añadimos al usuario a la sala
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            
            # (Opcional pero recomendado) Si la sala queda vacía, la eliminamos de la memoria
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    # Ahora pedimos el room_id para enviar el mensaje SOLO a los de esa sala
    async def broadcast(self, message: str, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

# Creamos una única instancia que usaremos en toda la aplicación
manager = ConnectionManager()
