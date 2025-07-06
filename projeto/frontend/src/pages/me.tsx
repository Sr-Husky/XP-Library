import Home from './home'
import CardModal from '../components/cardModal'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Me({ navMsg, limpaNavMsg }: { navMsg: string, limpaNavMsg: () => void }){

    const navigate = useNavigate();
    const userStr = localStorage.getItem("usuario");
    const user = (userStr) ? JSON.parse(userStr) : null;
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        if(navMsg){
            if(navMsg === "logout"){
                localStorage.removeItem("usuario");
                console.log("to aqui");
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
        if(!user) navigate('/entrar');
        const buscar = async () => {
            const res = await fetch('/mock/users.json');
            const json = await res.json();
            if((json.find((e) => e.id === user.id)).logado === false) navigate('/entrar');
            console.log(user.favoritos);
        }
        buscar();
    },[])

    return (
        <>
            {user && <Home user={true} id_user={user.id} favoritos={user.favoritos} />}
            {modal && <CardModal id={0} onClose={() => setModal(false)} />}
        </>
    )
}

export default Me