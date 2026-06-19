interface ActionButtonProps {
    children: React.ReactNode
    onClick?: () => void
}

export const ActionButton = ({ children, onClick }: ActionButtonProps) => {
    return (
        <button 
            onClick={onClick} 
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm px-6 py-4 
            text-blue-600 font-semibold shadow-sm ring-1 ring-inset ring-gray-900/5 
            transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5
            active:scale-95 active:shadow-sm"
        >
            <span className="relative z-10">{children}</span>
        </button>
    )
}