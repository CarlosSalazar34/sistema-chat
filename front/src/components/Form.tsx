import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const Form = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [charge, setCharge] = useState<boolean>(false);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (username === "" || password === "") {
            alert("Error todos los campos son obligatorios");
            return;
        }
        
        setCharge(true);
        try {
            // OAuth2PasswordRequestForm in FastAPI expects application/x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                navigate("/home")
            } else {
                alert(`Error: ${data.detail}`);
            }

        } catch (error) {
            console.log(error);
            alert("Error al conectar con el servidor.");
        } finally {
            setCharge(false);
        }
    }

    return (
        <form onSubmit={loginUser} className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-8 shadow-lg min-w-7/12">
            <div className="flex flex-col gap-2 mb-2 min-w-full items-center">
                <label htmlFor="username">Nombre de usuario</label>
                <input placeholder="usuario123" className="w-full border-b border-gray-300 outline-none transition-all focus:border-blue-700" type="text" id="username" value={username} onChange={(event) => {
                    setUsername(event.target.value);
                }} />
            </div>
            <div className="flex flex-col gap-2 min-w-full items-center">
                <label htmlFor="password">Contraseña</label>
                <input placeholder="*******" className="w-full border-b border-gray-300 outline-none transition-all focus:border-blue-700" type="password" id="password" value={password} onChange={(event) => {
                    setPassword(event.target.value);
                }} />
            </div>
            <button disabled={charge} className="text-white bg-blue-500 p-2 mt-5 w-full rounded-lg transition-colors hover:bg-blue-600" type="submit">Iniciar sesión</button>
        </form>
    )
}