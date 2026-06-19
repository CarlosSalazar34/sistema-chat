import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import { ActionButton } from "../components/ActionButton";
import { ChatRoom } from "../components/ChatRoom";

export default function HomePage() {
    const [user, setUser] = useState("")
    const [currentRoom, setCurrentRoom] = useState("")
    const [roomInput, setRoomInput] = useState("")
    const [isJoining, setIsJoining] = useState(false)

    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.username)
                }
            } catch (error) {
                console.error(error)
            }
        }
        obtenerUsuario()
        const parametrosUrl = new URLSearchParams(window.location.search);
        const salaInvitacion = parametrosUrl.get("room");
        if (salaInvitacion) {
            setCurrentRoom(salaInvitacion);
        }
    }, [])

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomInput.trim() !== "") {
            setCurrentRoom(roomInput.trim());
            setRoomInput("");
            setIsJoining(false);
        }
    }

    return (
        <main className="flex flex-col min-h-screen md:flex-row bg-transparent">
            <Menu>
                <div className="flex items-center gap-3 mb-2 md:mb-10 px-2 md:px-0">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-linear-to-tr from-white to-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-md">
                        {user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-blue-500/140 text-xs md:text-sm">Bienvenido de vuelta,</span>
                        <h1 className="text-blue-500 text-lg md:text-2xl font-bold leading-tight">{user}</h1>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-end md:justify-start gap-4">
                    {!isJoining ? (
                        <div className="px-2 md:px-0">
                            <ActionButton onClick={() => setIsJoining(true)}>
                                Crear o Unirse a una sala
                            </ActionButton>
                        </div>
                    ) : (
                        <form onSubmit={handleJoinRoom} className="flex flex-col gap-3 px-2 md:px-0 animate-[slideRightToLeft_0.3s_ease-out]">
                            <input
                                type="text"
                                placeholder="Nombre de la sala..."
                                value={roomInput}
                                onChange={(e) => setRoomInput(e.target.value)}
                                className="p-4 rounded-2xl bg-white/60 backdrop-blur-md outline-none border border-white/50 text-gray-800 placeholder-gray-500 focus:bg-white/80 focus:ring-2 focus:ring-white/50 transition-all shadow-inner"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                                    Entrar
                                </button>
                                <button type="button" onClick={() => setIsJoining(false)} className="flex-1 bg-white/50 text-gray-700 font-bold p-3 rounded-xl hover:bg-white/70 transition-colors border border-white/50">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Menu>

            <section className="md:flex-1 flex flex-col min-h-[90vh] md:min-h-screen section z-0 relative">
                {currentRoom ? (
                    <div className="h-full w-full p-2 md:p-5">
                        <ChatRoom
                            roomId={currentRoom}
                            username={user}
                            onLeave={() => setCurrentRoom("")}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center gap-4">
                        <div className="h-24 w-24 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/60">
                            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700">Tus mensajes, en tiempo real</h2>
                        <p className="text-md max-w-md">Selecciona o crea una sala en el menú lateral para empezar a conversar con tus amigos.</p>
                    </div>
                )}
            </section>
        </main>
    )
}