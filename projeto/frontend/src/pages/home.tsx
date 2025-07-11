import Card from '../components/card'
import SearchBox from '../components/editBox'
import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { getPublicXp } from '../services/xpService'
import { getUser } from '../services/userService'
import type { Xp } from '../types/xp'
import type { Fav } from '../types/fav'

function Home({ user, navMsg, limpaNavMsg }: { user?: boolean, navMsg?:string, limpaNavMsg?: () => void }){

    const [data, setData] = useState<Xp[]>([]);
    const [fav, setFav] = useState<Fav[]>([]);
    const [texto, setTexto] = useState("");
    const [tags, setTag] = useState<string[]>([]);
    const [enter, setEnter] = useState(false);
    const navigate = useNavigate();

    const userStr = localStorage.getItem("usuario");
    const local = (userStr) ? JSON.parse(userStr) : null;
    
    useEffect(() => {
        const buscarDados = async () => {
            if(user){
                const res = await getUser(local.id);
                setData(res.xp);
                setFav(res.favoritos);
            } else {
                const xp = await getPublicXp();
                setData(xp);
            }
        };
        buscarDados();
    }, []);

    useEffect(() => {
        if(navMsg){
            if(navMsg === "logout"){
                localStorage.removeItem("usuario");
                navigate('/entrar');
                limpaNavMsg()
            }
        }
    }, [navMsg])

    useEffect(() => {
        if(texto.startsWith('#') && (texto.endsWith(',') || texto.endsWith(' ') || enter)){
            if(enter) setTag(prev => [...prev, texto.toLowerCase()]);
            else setTag(prev => [...prev, texto.toLowerCase().slice(0, -1)]);
            setTexto("");
        }
        setEnter(false);
    }, [texto, enter])

    const filtrados = data.filter(xp =>
        (texto.trim()[0] === '#' ||
        xp.texto.toLowerCase().includes(texto.trim().toLowerCase())) &&
        (tags.length === 0 || 
        tags.some(tagFiltro => xp.tags.map((t: string) => t.toLowerCase()).includes(tagFiltro)))
    );

    function handleEnterPress() {
        setEnter(true);
    }

    return (
        <>
            <div className='flex justify-center'>
                <SearchBox style='mt-[20px] mx-[40px] ' rotulo='Buscar...' value={texto} onChange={setTexto} onEnter={handleEnterPress} />
            </div>
            <div className='flex justify-center w-full'>
                <div className='flex flex-wrap gap-2 max-w-[1000px] pt-4'>
                    {tags.map((t, index) => (
                        <p key={index} onClick={() => {setTag(prev => prev.filter((_, i) => i !== index))}} className="hover:bg-[rgb(255,30,30)] cursor-pointer text-white bg-white/10 px-3 py-1 rounded-full">
                            {t}
                        </p>
                    ))}
                </div>
            </div>
            {user && <>
                <div className='flex justify-center items-center flex-wrap p-[20px]'>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                    <h1 className='text-white text-[4vw] md:text-[2vw] mx-[3vw]'>Minhas experiências</h1>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                </div>
            </>}
            <div className='flex justify-center flex-wrap p-[20px]'>
                {filtrados.map(xp => (
                    <Card key={xp.id} card_id={xp.id} like={xp.likes} titulo={`Usuário ${xp.id_user}`} texto={xp.texto} />
                ))}
            </div>
            {(user && fav.length) && <>
                <div className='flex justify-center items-center flex-wrap p-[20px]'>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                    <h1 className='text-white text-[4vw] md:text-[2vw] mx-[3vw]'>Favoritos</h1>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                </div>
                <div className='flex justify-center flex-wrap p-[20px]'>
                    {fav.map(xp => (
                        <Card key={xp.id} card_id={xp.id} like={xp.likes} titulo={`${xp.autor}`} texto={xp.texto} />
                    ))}
                </div>
            </>}
        </>
    )
}

export default Home