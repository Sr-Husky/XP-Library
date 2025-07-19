import Card from '../components/card'
import SearchBox from '../components/editBox'
import { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { getPublicXp, getXpUser } from '../services/xpService'
import { deslogar } from '../services/userService'
import { useAuth } from '../contexts/AuthContext'
import type { Xp } from '../types/xp'
import type { Fav } from '../types/fav'
import { useQuery } from '@tanstack/react-query'

function Home({ userOn, navMsg, limpaNavMsg }: { userOn?: boolean, navMsg?: string, limpaNavMsg?: () => void }){

    const [fav, setFav] = useState<Fav[]>([]); // Variável para guardar os favoritos do usuário
    const [texto, setTexto] = useState(""); // Variável para controlar o campo de texto
    const [tags, setTag] = useState<string[]>([]); // Variável para guardar as tags
    const [enter, setEnter] = useState(false); // Variável para detectar se "enter" foi precionado
    const [filtrados, setFiltrado] = useState<Xp[]>([]);
    const { contextGetUser, contextLogout } = useAuth();
    const navigate = useNavigate();
    
    // Pega todas experiências favoritas de um usuário (chamada pelo '/me')
    useEffect(() => {
        if(userOn && contextGetUser()) {
            setFav(contextGetUser().favoritos);
        }
    }, [contextGetUser()]);

    // Recebe mensagem da barra e navegação para deslogar
    useEffect(() => {
        if(navMsg){
            if(navMsg === "logout"){
                deslogar();
                contextLogout();
                limpaNavMsg()
                navigate('/entrar');
            }
        }
    }, [navMsg])

    const { data } = useQuery({
        queryKey: ['xpUserCache'],
        queryFn: () => getXpUser(texto, tags.toString()),
        enabled: userOn, // só busca se for user
    });

    // Define uma tag e limpa a caixa de pesquisa
    useEffect(() => {
        // Detecta se é uma tag, ou apenas uma busca
        if(texto.startsWith('#') && (texto.endsWith(',') || texto.endsWith(' ') || enter)){
            if(enter) setTag(prev => [...prev, texto.toLowerCase()]);
            else setTag(prev => [...prev, texto.toLowerCase().slice(0, -1)]);
            setTexto("");
        }
        setEnter(false);
        
        // Função que se chama para filtrar toda vez que muda o texto ou as tags, ou o enter é precionado, se começa com '#' ele espera a tag ser adicionada
        (async () => {
            if(texto[0] !== '#'){
                if(userOn) setFiltrado(data);
                else setFiltrado(await getPublicXp(texto, tags.toString()));
            }
        })()

    }, [texto, tags, enter, data]) // Chama a função caso digite um caractere ou aperte enter

    function teste(){
        console.log(contextGetUser()?.favoritos);
    }

    return (
        <>
            {/* Campo de busca */}
            <div className='flex justify-center'>
                <SearchBox style='mt-[20px] mx-[40px] ' rotulo='Buscar...' value={texto} onChange={setTexto} onEnter={() => setEnter(true)} />
            </div>

            {/* Mostra as tags aplicadas e dá opção de remover */}
            <div className='flex justify-center w-full'>
                <div className='flex flex-wrap gap-2 max-w-[1000px] pt-4'>
                    {tags.map((t, index) => (
                        <p key={index} onClick={() => {setTag(prev => prev.filter((_, i) => i !== index))}} className="hover:bg-[rgb(255,30,30)] cursor-pointer text-white bg-white/10 px-3 py-1 rounded-full">
                            {t}
                        </p>
                    ))}
                </div>
            </div>

            {/* Se tem usuário logado (está na página "/me") */}
            {userOn && <>
                <div className='flex justify-center items-center flex-wrap p-[20px]'>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                    <h1 onClick={teste} className='text-white text-[4vw] md:text-[2vw] mx-[3vw]'>Minhas experiências</h1>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                </div>
            </>}

            {/* Mostra os cards com as experiências */}
            {filtrados && <>
                <div className='flex justify-center flex-wrap p-[20px]'>
                    {filtrados.map(xp => (
                        <Card key={xp.id} card_id={xp.id} like={xp.likes} titulo={`${xp.user.usuario}`} texto={xp.texto} />
                    ))}
                </div>
            </>}

            {/* Se tem usuário logado e ele tem favoritos (está na página "/me") */}
            {(userOn && fav.length) && <>
                <div className='flex justify-center items-center flex-wrap p-[20px]'>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                    <h1 className='text-white text-[4vw] md:text-[2vw] mx-[3vw]'>Favoritos</h1>
                    <hr className="flex my-6 border-white w-[15vw] md:w-[24vw]" />
                </div>
                {/* Mostra os cards com dados dos favoritos e passa parametro "fav" para usar no "cardModal" */}
                <div className='flex justify-center flex-wrap p-[20px]'>
                    {fav.map(xp => (
                        <Card key={xp.id} card_id={xp.id} like={xp.likes} titulo={`${xp.autor}`} texto={xp.texto} fav={true} />
                    ))}
                </div>
            </>}
        </>
    )
}

export default Home