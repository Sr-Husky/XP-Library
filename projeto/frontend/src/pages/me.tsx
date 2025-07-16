import Home from './home'
import CardModal from '../components/cardModal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, deslogar } from '../services/userService'
import type { User } from '../types/user'
import { useAuth } from '../contexts/AuthContext'

function Me({ navMsg, limpaNavMsg }: { navMsg: string, limpaNavMsg: () => void }){

    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false); // Controle para cardModal
    const [user, setUser] = useState<User>(); // Guarda um objeto com os dados do usuário logado
    const { contextLogout } = useAuth();

    const token = localStorage.getItem("token");

    // Recebe mensagem da navBar
    useEffect(() => {
        if(navMsg){
            // Mensagem para deslogar
            if(navMsg === "logout"){
                deslogar();
                contextLogout();
                limpaNavMsg()
                navigate('/entrar');
            }

            // mensagem para criar nova experiencia
            else if(navMsg === "nova"){
                setModal(true);
                limpaNavMsg()
            }
        }
    }, [navMsg])

    // Verifia se o usuário está logado, se nao estiver volta para pagina "/entrar"
    useEffect(() => {
        if(!token) navigate('/entrar');
        const validar = async () => {
            const res = await getUser();
            if(!res.logado){
                localStorage.removeItem("token");
                navigate('/entrar');
            }
            setUser(res);
        }
        validar();
    },[])

    return (
        <>
            {user && <Home userOn={true} /> /* Página para mostrar experiências do usuário */}
            {modal && <CardModal id={0} onClose={() => setModal(false)} /* Modal pra criar nova experiência */ />}
        </>
    )
}

export default Me