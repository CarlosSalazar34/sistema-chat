import { useNavigate } from "react-router-dom";
import { FormRegister } from "../components/FormRegister";

export const RegisterPage = () => {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col justify-center items-center min-h-screen px-4 md:px-0 py-8">
            <h1 className="text-3xl md:text-4xl font-medium text-blue-800 mb-2 text-center">Regístrate en el sistema</h1>
            <p className="text-lg md:text-xl font-medium mb-8 md:mb-10 text-center">Ingresa tus datos para crear tu cuenta</p>
            <FormRegister />
            <div className="flex flex-col gap-3 mt-8 w-full max-w-md items-center justify-center border-t border-gray-200 pt-6">
                <p className="text-gray-500 text-sm">¿Ya tienes una cuenta?</p>
                <button className="w-full text-blue-600 font-medium border border-blue-200 rounded-lg p-2.5 transition-all hover:bg-blue-50 hover:border-blue-300 active:scale-[0.98] cursor-pointer" onClick={() => {
                    navigate("/");
                }}>
                    Inicia sesión
                </button>
            </div>
        </main>
    )
}