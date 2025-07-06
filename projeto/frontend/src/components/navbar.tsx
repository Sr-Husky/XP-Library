import { useLocation } from 'react-router-dom'
import Botao from './botao'

function Navbar({ func }: { func: (tipo: string) => void }) {

    const location = useLocation();

    return (
        <div className="w-full bg-[rgb(40,40,40)] shadow-xl h-14 md:h-16 fixed top-0 z-50 text-sm md:text-lg">
            {location.pathname === '/me' && <>
                <Botao texto='Logout' onClick={() => func("logout")} style='absolute right-[16px] top-1/2 -translate-y-1/2 text-white bg-red-500 border-[0px] w-[100px] h-[33px] hover:bg-red-600 hover:font-normal' styleTexto='text-[15pt]' />
                <Botao texto='+ Nova experiência' onClick={() => {func("nova");}} style='absolute right-[150px] top-1/2 -translate-y-1/2 text-white max-w-[250px] w-[250px] h-[33px] hover:font-normal' styleTexto='text-[15pt]' />
            </>}
            {/*Só rascunho*/}
            {false && <>
                    <p className="absolute left-4 top-1/2 -translate-y-1/2 text-white">Esquerda</p>
                    <p className="absolute right-4 top-1/2 -translate-y-1/2 text-white">Direita</p>
            </>}
        </div>
    );
}

export default Navbar;