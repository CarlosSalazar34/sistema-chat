import { useEffect, useState, useRef } from "react";

interface ChatRoomProps {
    roomId: string;
    username: string;
    onLeave: () => void;
}

export const ChatRoom = ({ roomId, username, onLeave }: ChatRoomProps) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al final cuando llega un mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cargar historial
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${roomId}/messages`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (res.ok) {
                    const history = await res.json();
                    const formattedHistory = history.map((msg: any) => `${msg.sender_username}: ${msg.content}`);
                    setMessages(formattedHistory);
                }
            } catch (error) {
                console.error("Error al cargar historial:", error);
            }
        };

        fetchHistory();
    }, [roomId]);

    // Conectar WebSocket
    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL.replace("http", "ws");
        ws.current = new WebSocket(`${backendUrl}/ws/${roomId}/${username}`);

        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomId, username]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() !== "" && ws.current) {
            ws.current.send(inputMessage);
            setInputMessage("");
        }
    };

    const compartirSala = () => {
        const urlBase = window.location.origin + window.location.pathname;
        const urlInvitacion = `${urlBase}?room=${roomId}`;
        navigator.clipboard.writeText(urlInvitacion)
            .then(() => alert("¡Enlace copiado! Envíalo a tus amigos."))
            .catch(() => alert("No se pudo copiar el enlace"));
    };

    return (
        <div className="flex flex-col h-[85vh] md:h-full w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/50 overflow-hidden relative">

            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Sala: {roomId}</h2>
                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En línea
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={compartirSala} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-all font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        <span className="hidden md:inline">Compartir</span>
                    </button>
                    <button onClick={onLeave} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 md:px-4 md:py-2 rounded-xl transition-all font-medium flex items-center gap-2">
                        <span className="hidden md:inline">Salir</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 scroll-smooth">
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 animate-pulse">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>No hay mensajes aún. ¡Rompe el hielo!</p>
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isMine = msg.startsWith(`${username}:`);
                    const messageContent = msg.replace(`${isMine ? username : msg.split(':')[0]}: `, '');
                    const senderName = isMine ? 'Tú' : msg.split(':')[0];

                    return (
                        <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%] ${isMine ? 'self-end' : 'self-start'}`}>
                            {!isMine && <span className="text-xs text-gray-500 ml-1 mb-1 font-medium">{senderName}</span>}
                            <div className={`p-3 md:p-4 rounded-2xl shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                                {messageContent}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 md:p-4 bg-white/80 backdrop-blur-md border-t border-gray-200/50 flex gap-2 items-center">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-100/50 border border-transparent rounded-full px-5 py-3 md:py-4 outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all text-gray-700"
                />
                <button type="submit" disabled={!inputMessage.trim()} className="bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white p-3 md:p-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
        </div>
    );
};
