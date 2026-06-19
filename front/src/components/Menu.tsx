export const Menu = ({ children }: { children: React.ReactNode }) => {
    return (
        <aside className="menu justify-between md:justify-start p-6 md:flex-col flex flex-row min-h-[10vh] md:min-h-[90vh] md:w-1/4 w-full 
            bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
            md:m-5 rounded-none md:rounded-3xl z-10 sticky top-0 transition-all duration-300">
            {children}
        </aside>
    )
}