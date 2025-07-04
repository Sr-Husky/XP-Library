function Navbar() {
    return (
        <div className="w-full bg-[rgb(40,40,40)] shadow-xl h-14 md:h-16 fixed top-0 z-50 text-sm md:text-lg">
            <p className="absolute left-4 top-1/2 -translate-y-1/2 text-white">Esquerda</p>
            <p className="absolute right-4 top-1/2 -translate-y-1/2 text-white">Direita</p>
        </div>
    );
}

export default Navbar;