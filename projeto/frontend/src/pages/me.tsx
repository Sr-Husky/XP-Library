import Home from './home'
import CardModal from '../components/cardModal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/userService'
import type { User } from '../types/user'

function Me({ navMsg, limpaNavMsg }: { navMsg: string, limpaNavMsg: () => void }){

    const navigate = useNavigate();
    const userStr = localStorage.getItem("usuario");
    const local = (userStr) ? JSON.parse(userStr) : null;
    const [modal, setModal] = useState<boolean>(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        if(navMsg){
            if(navMsg === "logout"){
                localStorage.removeItem("usuario");
                navigate('/entrar');
                limpaNavMsg()
            }
            else if(navMsg === "nova"){
                setModal(true);
                limpaNavMsg()
            }
        }
    }, [navMsg])

    useEffect(() => {
        if(!local) navigate('/entrar');
        const validar = async () => {
            const res = await getUser(local.id);
            if(!res.logado){
                localStorage.removeItem("usuario");
                navigate('/entrar');
            }
            setUser(res);
        }
        validar();
    },[])

    return (
        <>
            {user && <Home user={true} />}
            {modal && <CardModal id={0} onClose={() => setModal(false)} />}
        </>
    )
}

export default Me