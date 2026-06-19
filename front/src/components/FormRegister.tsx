import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const FormRegister = () => {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const [charge, setCharge] = useState<boolean>(false);

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (name === "" || username === "" || password === "") {
            alert("Todos los campos son obligatorios")
            return;
        }
        
        setCharge(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                })
            });
            if (res.ok) {
                // alert("¡Registro exitoso! Ya puedes iniciar sesión.");
                navigate("/login");
                // Opcional: limpiar el formulario o redirigir
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (error) {
            console.log(error);
            alert("Error al conectar con el servidor.");
        } finally {
            setCharge(false);
        }
    }

    return (
        <form onSubmit={register} className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-6 md:p-8 shadow-lg w-full max-w-md bg-white">
            <div className="flex flex-col gap-2 mb-4 w-full items-center">
                <label htmlFor="name">Nombre completo</label>
                <input placeholder="Juan Pérez" className="w-full border-b border-gray-300 outline-none transition-all focus:border-blue-700" type="text" id="name" value={name} onChange={(event) => {
                    setName(event.target.value);
                }} />
            </div>
            <div className="flex flex-col gap-2 mb-4 min-w-full items-center">
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
            <button className="text-white bg-blue-500 p-2 mt-5 w-full rounded-lg transition-colors hover:bg-blue-600" disabled={charge} type="submit">Crear cuenta</button>
        </form>
    )
}