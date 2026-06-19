import { useState } from "react"

export const FormRegister = () => {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-8 shadow-lg min-w-7/12">
            <div className="flex flex-col gap-2 mb-4 min-w-full items-center">
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
            <button className="text-white bg-blue-500 p-2 mt-5 w-full rounded-lg transition-colors hover:bg-blue-600" type="submit">Crear cuenta</button>
        </form>
    )
}