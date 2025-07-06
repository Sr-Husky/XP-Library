import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect }  from 'react'
import Botao from './botao'

function Navbar({ func }: { func: (tipo: string) => void }) {

    const location = useLocation();
    const navigate = useNavigate();
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const mudar = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", mudar);
        return () => window.removeEventListener("resize", mudar);
    }, []);

    const userStr = localStorage.getItem("usuario");
    let user = (userStr) ? JSON.parse(userStr) : null;

    useEffect(() => {
        if(user){
            const buscar = async () => {
                const res = await fetch('/mock/users.json');
                const json = await res.json();
                if((json.find((e) => e.id === user.id)).logado === false) user = false;
            }
            buscar();
        }
    },[])

    return (
        <div className="w-full bg-[rgb(40,40,40)] shadow-xl h-14 md:h-16 fixed top-0 z-50 text-sm md:text-lg">
            {user ? <>
                <Botao texto='Home' onClick={() => navigate('/')} style='absolute left-[16px] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[100px] h-[33px] hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                <Botao texto='Perfil' onClick={() => navigate('/me')} style='absolute left-[180px] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[100px] h-[33px] hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                <Botao texto='Logout' onClick={() => func("logout")} style='absolute right-[16px] top-1/2 -translate-y-1/2 text-white bg-red-500 border-[0px] w-[100px] h-[33px] hover:bg-red-600 hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                {location.pathname === '/me' && <>
                    <Botao texto='+ Nova experiência' onClick={() => {func("nova");}} style='absolute right-[200px] top-1/2 -translate-y-1/2 text-white max-w-[250px] w-[250px] h-[33px] hover:font-normal' styleTexto='lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                </>}
            </> : <>
                {location.pathname !== '/entrar' ? <>
                    <Botao texto='Login' onClick={() => navigate('/entrar')} style='absolute right-[16px] top-1/2 -translate-y-1/2 text-white w-[100px] h-[33px] hover:bg-green-600 hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                </> : <>
                    <Botao texto='XP Library' onClick={() => navigate('/')} style='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] text-white w-[150px] h-[90px] md:w-[120px] md:h-[50px] xl:w-[140] xl:h-[60] hover:font-normal' styleTexto='text-[3.5vw] sm:[2.6vw] md:text-[2.2vw] lg:text-[1.7vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                </>} 
            </>}
        </div>
    );
}

export default Navbar;