import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect }  from 'react'
import { HomeIcon, UserIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { getUsers } from '../services/userService'
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
                const res = await getUsers();
                if((res.find((e) => e.id === user.id)).logado === false) user = false;
            }
            buscar();
        }
    },[])

    return (
        <div className="w-full bg-[rgb(40,40,40)] shadow-xl h-[70px] md:h-16 fixed top-0 z-50 text-sm md:text-lg">
            {size.width >= 1200 ? <>
                {user ? <>
                    <Botao texto='Home' onClick={() => navigate('/')} style='absolute left-[1vw] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[100px] h-[33px] hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                    <Botao texto='Perfil' onClick={() => navigate('/me')} style='absolute left-[12vw] 2xl:left-[180px] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[100px] h-[33px] hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                    <Botao texto='Logout' onClick={() => func("logout")} style='absolute right-[16px] top-1/2 -translate-y-1/2 text-white bg-red-500 border-[0px] w-[100px] h-[33px] hover:bg-red-600 hover:font-normal' styleTexto=' lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                    {location.pathname === '/me' && <>
                        <Botao texto='+ Nova experiência' onClick={() => {func("nova");}} style='absolute right-[200px] top-1/2 -translate-y-1/2 text-white max-w-[250px] w-[250px] h-[33px] hover:font-normal' styleTexto='lg:text-[2vw] xl:text-[1.5vw] 2xl:text-[1vw]' />
                    </>}
                </> : <>
                    {location.pathname !== '/entrar' ? <>
                        <button onClick={() => navigate('/entrar')} className="absolute right-[16px] rounded-[10px] bg-[rgb(0,170,0)] hover:bg-[rgb(0,130,0)] top-1/2 -translate-y-1/2 text-white w-[120px] h-[50px]"><div className='flex'><p className='ml-[18px] text-[22px]'>Login</p><ArrowRightOnRectangleIcon  className="w-full h-7" /></div></button>
                        <Botao texto='XP Library' onClick={() => navigate('/')} style='absolute left-[16px] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[150px] h-[80px] hover:font-normal' styleTexto='text-[22px]' />
                    </> : <>
                        <Botao texto='XP Library' onClick={() => navigate('/')} style='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] text-white max-w-[200px] w-[200px] h-[90px] hover:font-normal' styleTexto='text-[30px]' />
                    </>} 
                </>}
            </> : <>
                {user ? <>
                    <button onClick={() => navigate('/')} className="absolute left-[16px] rounded-[10px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[50px] h-[50px]"><HomeIcon  className="w-full h-7" /></button>
                    <button onClick={() => navigate('/me')} className="absolute left-[80px] rounded-[10px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[50px] h-[50px]"><UserIcon  className="w-full h-7" /></button>
                    <button onClick={() => func("logout")} className="absolute right-[16px] rounded-[10px] bg-[rgb(255,50,50)]  hover:bg-[rgb(210,0,0)] top-1/2 -translate-y-1/2 text-white w-[50px] h-[50px]"><ArrowLeftOnRectangleIcon  className="w-full h-7" /></button>
                    {location.pathname === '/me' && <>
                        <Botao texto='+' onClick={() => {func("nova");}} style='absolute right-[80px] rounded-[10px] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[50px] h-[50px]' styleTexto='mt-[-5px] text-[20pt]' />
                    </>}
                </> : <>
                    {location.pathname !== '/entrar' ? <>
                        <button onClick={() => navigate('/entrar')} className="absolute right-[16px] rounded-[10px] bg-[rgb(0,170,0)] hover:bg-[rgb(0,130,0)] top-1/2 -translate-y-1/2 text-white w-[80px] h-[50px]"><ArrowRightOnRectangleIcon  className="w-full h-7" /></button>
                        <Botao texto='XP Library' onClick={() => navigate('/')} style='absolute left-[16px] rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] top-1/2 -translate-y-1/2 text-white w-[150px] h-[80px] hover:font-normal' styleTexto='text-[22px]' />
                    </> : <>
                        <Botao texto='XP Library' onClick={() => navigate('/')} style='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[10px] border-[0px] bg-[rgb(80,80,80)] hover:bg-[rgb(50,50,50)] text-white w-[150px] h-[90px] hover:font-normal' styleTexto='text-[20px]' />
                    </>} 
                </>}
            </>}
        </div>
    );
}

export default Navbar;