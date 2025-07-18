import { useState, useEffect, useRef } from 'react'
import { PencilIcon, TrashIcon, XMarkIcon, CheckIcon, HandThumbUpIcon, StarIcon, LockClosedIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom'
import { getXp, criarXp, atualizaXp, removeXp } from '../services/xpService'
import { like, favoritar, desfavoritar, deslike } from '../services/interactService';
import type { Xp } from '../types/xp'
import type { User } from '../types/user'
import Confirmar from './confirmar'
import type { Fav } from '../types/fav';
import { useAuth } from '../contexts/AuthContext'
import { useQuery, useQueryClient } from '@tanstack/react-query';

function CardModal({ id, onClose, fav }: { id: number, onClose: () => void, fav?: boolean}){

    const [cardObj, setCardObj] = useState<Xp>(); // Objeto da experiência mostrado no modal
    const [favObj, setFavObj] = useState<Fav>(); // Objeto da experiência mostrado no modal caso seja um objeto do tipo "Fav"
    const [user, setUser] = useState<User>(); // Usuário autor do card
    const [editConf, setEditConf] = useState<boolean>(false); // Mostra/Esconde modal de confirmação da edição
    const [delConf, setDelConf] = useState<boolean>(false); // Mostra/Esconde modal de confirmação da deleção
    const [cancelConf, setCancelConf] = useState<boolean>(false); // Mostra/Esconde modal de confirmação do descarte das alterações
    const [pubConf, setPubConf] = useState<boolean>(false); // Mostra/Esconde modal de confirmação da publicação
    const [desfavConf, setDesfavConf] = useState<boolean>(false); // Mostra/Esconde modal de confirmação da desfavoritação
    const [editMode, setEditMode] = useState<boolean>(false) // Abre o modal no modo de edição
    const [tagEdit, setTagEdit] = useState<string[]>([]) // Variável que controla o campo "tags" do controle de edição
    const [textoEdit, setTextoEdit] = useState<string>("") // Variável que controla o campo "texto" do controle de edição
    const [contextoEdit, setContextoEdit] = useState<string>("") // Variável que controla o campo "contexo" do controle de edição
    const [tagText, setTagText] = useState<string>('') // Variável que controla o campo de input de tags
    const ref = [useRef<HTMLTextAreaElement>(null), useRef<HTMLTextAreaElement>(null)]; // 2 useRef para pegar referencia de 2 textAreas diferentes
    const queryClient = useQueryClient();
    const location = useLocation();
    const { contextGetUser } = useAuth();

    // Busca os dados do usuário autor e da experiencia na API
    useEffect(() => {
        const userUpdate = contextGetUser();
        if(userUpdate) {
            setUser(userUpdate);
            if(fav) setFavObj(userUpdate.favoritos.find(e => e.id === id));
        }
    }, [contextGetUser()]);

    // Busca os dados da experiencia
    const buscarXpPorId = async (id: number) => {
        return await getXp(id);
    };

    // UseQuery para manter os dados atualizados
    const { data, isSuccess } = useQuery({
        queryKey: ['experiencia', id],
        queryFn: () => buscarXpPorId(id),
        enabled: !!id, // só executa se houver um id válido
    });

    // Coloca os dados iniciais e atualiza se necessário
    useEffect(() => {
        if (isSuccess && data) {
            setCardObj(data);
            setTextoEdit(data.texto);
            setContextoEdit(data.contexto);
            setTagEdit(data.tags);
        }
    }, [isSuccess, data]);

    // Caso não tenha id, modo de edição
    useEffect(() => {
        if (!id) {
            setCardObj(JSON.parse('{"texto":"","contexto":""}'))
            setEditMode(true);
        }
    }, []);

    // Ajusta a altura inicial dos textArea
    useEffect(() => {
        for(let x=0; x<2; x++){
            if (ref[x].current) {
                ref[x].current.style.height = "auto";
                ref[x].current.style.height = `${ref[x].current.scrollHeight}px`;
            }
        }
    }, [editMode]); // Atualiza assim que o modo de edição é ativado

    // Configura o tamanho do textArea a cada input
    function textareaConfig(e: any){
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    }

    // Esconde a barra de rolagem do site principal na abertura no modal
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Função para validar e adicionar tags na variável de controle "tagEdit"
    function addTag(){
        var v = tagText;
        if(!v.startsWith('#')) v="#"+v; // Adiciona # se não tiver
        if(v.endsWith(',')) v=v.slice(0,-1); // Tira a virgula do final, se tiver
        if(v !== '#' && !tagEdit.find(e => e === v)) setTagEdit(prev => [...prev, v.toLocaleLowerCase()]); // Verifica se a tag é vazia ou se já existe, caso não, adiciona
    }

    function editUpdate(pub?: boolean){
        editar(pub);
        queryClient.invalidateQueries(['user']);
        queryClient.invalidateQueries([`experiencia ${id}`]);
        queryClient.invalidateQueries(['xpUserCache']);
    }

    // Edita uma experiencia ou cria uma nova
    function editar(pub?: boolean){
        // Caso nenhuma experiencia seja passada para o modal, criar uma
        if(!id){
            const novo: Xp = {
                texto: textoEdit,
                contexto: contextoEdit,
                tags: tagEdit,
                data: new Date().toISOString(),
                mod: new Date().toISOString(),
                pub: false,
                likes: 0
            }

            const criar = async () => {
                return await criarXp(novo);
            }
            criar();

        // Caso tenha uma experiencia, editar com os dados digitados nos textArea
        } else {
            const atualizar = async () => {
                return await atualizaXp({
                    id: id,
                    texto: textoEdit,
                    contexto: contextoEdit,
                    tags: tagEdit,
                    pub: ((pub === undefined) ? cardObj.pub : pub), // Caso seja passado o parametro, é apenas uma mudança de visibilidade, atualizar a visibilidade
                    likes: ((pub === undefined) ? 0 : cardObj.likes) // Caso seja passado o parametro, é apenas uma mudança de visibilidade, não zerar os likes
                });
            };
            atualizar();
        }
    }

    // Verifica se é favorito
    function isFav(){
        // Retonar se é ou não favorito para desfavoritar na pagina "/"
        if(!fav) return user.favoritos.find(e => e.autorId === cardObj.id_user && e.texto === cardObj.texto && e.contexto === cardObj.contexto && e.data === cardObj.mod);
        // Retonar se é ou não favorito para desfavoritar na pagina "/me"
        else return favObj;
    }

    // Adiciona a experiencia nos favoritos
    function addFav(){
        favoritar({
            id_user: user.id,
            autor: cardObj.user.usuario,
            autorId: cardObj.id_user,
            texto: cardObj.texto,
            contexto: cardObj.contexto,
            tags: cardObj.tags,
            data: cardObj.mod,
            likes: cardObj.likes
        }).finally(() => queryClient.invalidateQueries(['user']))
    }

    // Exclui uma experiencia
    function excluir(){
        removeXp(cardObj.id).finally(() => queryClient.invalidateQueries(['xpUserCache']));
        onClose();
    }

    function desfav(quit: boolean){
        desfavoritar(isFav()).finally(() => queryClient.invalidateQueries(['user']));
        if(quit) onClose();
    }

    function addlike(){
        like(cardObj.id).finally(() => {
            queryClient.invalidateQueries(['user']);
        })
    }

    function rmlike(){
        deslike(cardObj.id, user.like.filter(e => e !== cardObj.id)).finally(() => {
            queryClient.invalidateQueries(['user']);
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-[rgb(100,100,100)] p-8 rounded-lg w-[600px] max-h-screen overflow-auto">

                {/* MODO PADRÂO */}
                {!editMode ? <>
                    <button onClick={onClose} className="absolute text-white font-bold p-[3px] top-[20px] right-[16px] bg-gray-600 rounded-full"><XMarkIcon  className="w-7 h-7" /></button>

                    {/* Se tem usuário logado, já carregou a experiencia e a experiencia não é do usuário logado */}
                    { user && ((cardObj && !(cardObj.id_user === user.id)) || (fav)) && <>

                        {/* Se está no "/me" mostra apenas botão desfavoritar, senão, mostra botão de fav/desfav e like/deslike */}
                        {location.pathname === '/me' ? <>
                            {/* Botão desfavoritar */}
                            <button onClick={() => setDesfavConf(true)} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><StarIconSolid  className="w-7 h-7" /></button>
                            {desfavConf && <Confirmar titulo="Tem certeza que deseja desfavoritar?" texto="Essa ação pode ser irreversível, pois a experiência pode não estar mais disponível" func={() => desfav(true)} close={() => setDesfavConf(false)} />}
                        </> : <> 
                            {user && <>
                                {/* Botão like/deslike */}
                                {(user.like.find(e => e === id)) ?
                                    <button onClick={() => rmlike()} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><HandThumbUpIconSolid  className="w-7 h-7" /></button>
                                    :
                                    <button onClick={() => addlike()} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><HandThumbUpIcon  className="w-7 h-7" /></button>
                                }
                                {/* Botão fav/desfav */}
                                {(isFav()) ?
                                    <button onClick={() => desfav(false)} className="absolute text-white font-bold p-[3px] top-[20px] right-[105px] bg-gray-600 rounded-full"><StarIconSolid  className="w-7 h-7" /></button>
                                    :
                                    <button onClick={() => addFav()} className="absolute text-white font-bold p-[3px] top-[20px] right-[105px] bg-gray-600 rounded-full"><StarIcon  className="w-7 h-7" /></button>
                                }
                            </>} 
                        </>
                        }
                    </>}

                    {/* Se está na página "/me", já carregou a experiencia e a experiencia é do usuário logado */}
                    {location.pathname === "/me" && !fav && cardObj && user && cardObj.id_user === user.id && <>
                        {/* Botão de editar */}
                        <button onClick={() => setEditConf(true)} className="absolute text-yellow-400 font-bold p-[6px] top-[20px] right-[60px] bg-gray-600 rounded-full"><PencilIcon className="w-5 h-5" /></button>
                        {editConf && <Confirmar titulo="Tem certeza que deseja editar?" texto="Essa é uma experiencia pública, ao edita-la voce perderá a contagem de likes" func={() => setEditMode(true)} close={() => setEditConf(false)} />}
                        {/* Botão de excluir */}
                        <button onClick={() => setDelConf(true)} className="absolute text-red-400 font-bold p-[6px] top-[20px] right-[105px] bg-gray-600 rounded-full"><TrashIcon className="w-5 h-5" /></button>
                        {delConf && <Confirmar titulo="Tem certeza que deseja excluir?" texto="Voce está preste a deletar essa experiência para sempre, essa ação não poderá ser desfeita" func={() => excluir()} close={() => setDelConf(false)} />}
                        {/* Botão de público/privado */}
                        {cardObj.pub ? <>
                            {/* Público (tornar privado) */}
                            <button onClick={() => editUpdate(false)} className="absolute text-green-400 font-bold p-[6px] top-[20px] right-[150px] bg-gray-600 rounded-full"><GlobeAltIcon className="w-5 h-5" /></button>
                        </> : <>
                            {/* Privado (tornar público) */}
                            <button onClick={() => setPubConf(true)} className="absolute text-blue-400 font-bold p-[6px] top-[20px] right-[150px] bg-gray-600 rounded-full"><LockClosedIcon className="w-5 h-5" /></button>
                            {pubConf && <Confirmar titulo="Tem certeza que deseja tornar público" texto="Ao tornar essa experiência pública, ela ficará disponível para qualquer pessoa, podendo ser salva por outros usuários" func={() => editUpdate(true)} close={() => setPubConf(false)} />}
                        </>}
                    </>}

                    {/* Se não é do tipo favorito e já carregou a experiencia ou se é do tipo favorito e já carregou o favorito */}
                    {((!fav && cardObj) || (fav && favObj)) ?  (
                        <> 
                            {/* Mostrar dados do objeto do tipo Xp ou do objeto do tipo fav */}
                            <p className="text-white pb-4 font-bold">{fav ? favObj.autor : cardObj.user.usuario}</p>
                            <p className="text-white">{fav ? favObj.texto : cardObj.texto}</p>
                            <hr className="my-6 border-white" />
                            <p className="text-white">{fav ? favObj.contexto : cardObj.contexto}</p>
                            <hr className="my-6 border-white" />
                            <div className='flex flex-wrap gap-2'>
                                {(fav ? favObj : cardObj).tags.map((t, index) => (
                                    <p key={index} className="text-white bg-white/10 px-3 py-1 rounded-full">
                                        {t}
                                    </p>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-white">Carregando...</p>
                    )}

                {/* MODO DE EDIÇÂO */}
                </> : <>

                    {/* Botão de confirmar edição */}
                    <button onClick={() => {editUpdate(); onClose()}} className="absolute text-white font-bold p-[6px] top-[20px] right-[16px] bg-gray-600 rounded-full"><CheckIcon className="w-6 h-6 text-green-600" /></button>
                    {/* Botão de fechar (descartar edição) */}
                    <button onClick={() => setCancelConf(true)} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><XMarkIcon  className="w-7 h-7 text-red-400" /></button>
                    {cancelConf && <Confirmar titulo="Cancelar alterações?" texto="Todas as alterações feitas serão descartadas, essa ação não poderá ser desfeita" func={onClose} close={() => setCancelConf(false)} />}
                    
                    {/* Quando já tiver carregado o card */}
                    {cardObj ? (
                        <>
                            <p className="text-white pb-4 font-bold">{id ? "Editar experiência" : "Nova experiência"}</p>
                            {/* textArea do "texto" */}
                            <textarea onChange={(e) => setTextoEdit(e.target.value)} value={textoEdit} ref={ref[0]} onInput={e => textareaConfig(e)} placeholder='Sua experiência' className="focus:outline-none text-white bg-transparent w-full overflow-hidden resize-none" rows={1} />
                            <hr className="my-6 border-white" />
                            {/* textArea do "contexto" */}
                            <textarea onChange={(e) => setContextoEdit(e.target.value)} value={contextoEdit} ref={ref[1]} onInput={e => textareaConfig(e)} placeholder='Contexto da experiência' className="focus:outline-none text-white bg-transparent w-full overflow-hidden resize-none" rows={1} />
                            <hr className="my-6 border-white" />
                            {/* Exibição das tags */}
                            <div className='flex flex-wrap gap-2'>
                                {tagEdit.map((t, index) => (
                                    <p key={index} onClick={() => { setTagEdit(tagEdit.filter(item => item !== tagEdit[index])) }} className="hover:bg-red-500 cursor-pointer text-white bg-white/10 px-3 py-1 rounded-full">
                                        {t}
                                    </p>
                                ))}
                            </div>
                            {/* Campo de texto para adicionar tags */}
                            <div className='flex justify-center item-center'>
                                {/* input controlado por tagText, aplica qualquer caractere exeto (',' e ' '), pois esses caracteres, junto com 'enter', chamam a função 'addTag' e limpa o input */}
                                <input value={tagText} onChange={(e) => {if(!(e.target.value.endsWith(',') || e.target.value.endsWith(' ')))setTagText(e.target.value)}} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ',' || e.key === ' '){addTag(); setTagText('');}}} placeholder='Adicionar tag' className={`bg-white/10 rounded-full py-[5px] mt-[8px] w-full h-full text-white px-4 mr-[10px] focus:outline-none`} />
                                {/* botão de adicionar (+) */}
                                <p onClick={() => {addTag(); setTagText('');}} className="text-center hover:bg-gray-600 cursor-pointer text-white bg-white/10 py-1 rounded-full mt-[8px] w-[35px]">+</p>
                            </div>

                        </>
                    ) : (
                        <p className="text-white">Carregando...</p>
                    )}
                </>}
            </div>
        </div>
    );

}

export default CardModal