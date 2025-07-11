import { useState, useEffect, useRef } from 'react'
import { PencilIcon, TrashIcon, XMarkIcon, CheckIcon, HandThumbUpIcon, StarIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom'
import { getXp, criarXp, atualizaXp, removeXp } from '../services/xpService'
import { getUser } from '../services/userService';
import type { Xp } from '../types/xp'
import type { User } from '../types/user'
import Confirmar from './confirmar'

function CardModal({ id, onClose }: { id: number; onClose: () => void }){

    const [data, setData] = useState<Xp>();
    const [user, setUser] = useState<User>();
    const [conf1, setConf1] = useState<boolean>(false);
    const [conf2, setConf2] = useState<boolean>(false);
    const [conf3, setConf3] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false)
    const [tagEdit, setTagEdit] = useState<string[]>([])
    const [textoEdit, setTextoEdit] = useState<string>("")
    const [contextoEdit, setContextoEdit] = useState<string>("")
    const [tagText, setTagText] = useState<string>('')
    const location = useLocation();
    const ref = [useRef<HTMLTextAreaElement>(null), useRef<HTMLTextAreaElement>(null), useRef<HTMLTextAreaElement>(null)];
    const userStr = localStorage.getItem("usuario");
    const local = (userStr) ? JSON.parse(userStr) : null;

    useEffect(() => {
        
        const buscarUser = async () => {
            const res = await getUser(local.id);
            setUser(res);
        }
        buscarUser();
        if(id){
            const buscar = async () => {
                const res = await getXp(id);
                setData(res);
                setTextoEdit(res.texto);
                setContextoEdit(res.contexto);
                setTagEdit(res.tags);
            }
            
            buscar();
        } else {
            setData(JSON.parse('{"texto":"","contexto":""}'))
            setEditMode(true);
        }
    }, [])

    useEffect(() => {
        for(let x=0; x<3; x++){
            if (ref[x].current) {
                // ajustar altura inicial
                ref[x].current.style.height = "auto";
                ref[x].current.style.height = `${ref[x].current.scrollHeight}px`;
            }
        }
    }, [editMode]);


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    function addTag(){
        var v = tagText;
        if(!v.startsWith('#')) v="#"+v;
        if(v.endsWith(',')) v=v.slice(0,-1);
        if(v !== '#' && !tagEdit.find(e => e === v)) setTagEdit(prev => [...prev, v.toLocaleLowerCase()]);
    }

    function textareaConfig(e: any){
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    }

    function editar(pub?: boolean){
        // aqui eu vou editar o trem ou criar um trem novo
        if(!id){
            const novo: Xp = {
                id_user: user.id,
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
        } else {
            const atualizar = async () => {
                return await atualizaXp({
                    id: id, 
                    texto: textoEdit, 
                    contexto: contextoEdit, 
                    tags: tagEdit, 
                    pub: ((pub === undefined) ? data.pub : pub), 
                    likes: ((pub === undefined) ? 0 : data.likes)
                });
            };
            atualizar();
        }

    }

    function addFav(){
        //console.log(user.favoritos.find(e => e.autorId === data.id_user && e.texto === data.texto && e.contexto === data.contexto));
    }

    function remFav(){
        // aqui eu vou desfavoritar o trem
    }

    function addLike(){
        // aqui eu vou botar o like no trem
    }

    function remLike(){
        // aqui eu vou tirar o like do trem
    }

    function excluir(){
        removeXp(data.id);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-[rgb(100,100,100)] p-8 rounded-lg w-[600px] max-h-screen overflow-auto">
                {!editMode ? <>
                    <button onClick={onClose} className="absolute text-white font-bold p-[3px] top-[20px] right-[16px] bg-gray-600 rounded-full"><XMarkIcon  className="w-7 h-7" /></button>
                    { local && data && !(data.id_user === local.id) && <>
                        {location.pathname === '/me' ? 
                            <button onClick={() => remFav()} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><StarIconSolid  className="w-7 h-7" /></button>
                            :
                            <> {user && <>
                                {(user.like.find(e => e === id)) ?
                                    <button onClick={() => remLike()} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><HandThumbUpIconSolid  className="w-7 h-7" /></button>
                                    :
                                    <button onClick={() => addLike()} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><HandThumbUpIcon  className="w-7 h-7" /></button>
                                }
                                {(user.favoritos.find(e => e.autorId === data.id_user && e.texto === data.texto && e.contexto === data.contexto)) ?
                                    <button onClick={() => remFav()} className="absolute text-white font-bold p-[3px] top-[20px] right-[105px] bg-gray-600 rounded-full"><StarIconSolid  className="w-7 h-7" /></button>
                                    :
                                    <button onClick={() => addFav()} className="absolute text-white font-bold p-[3px] top-[20px] right-[105px] bg-gray-600 rounded-full"><StarIcon  className="w-7 h-7" /></button>
                                }
                            </>} </>
                        }
                    </>}
                    {location.pathname === "/me" && data && data.id_user === local.id && <>
                        <button onClick={() => setConf1(true)} className="absolute text-white font-bold p-[6px] top-[20px] right-[60px] bg-gray-600 rounded-full"><PencilIcon className="w-5 h-5" /></button>
                        {conf1 && <Confirmar titulo="Tem certeza que deseja editar?" texto="Essa é uma experiencia pública, ao edita-la voce perderá a contagem de likes" func={() => setEditMode(true)} close={() => setConf1(false)} />}
                        <button onClick={() => setConf2(true)} className="absolute text-red-400 font-bold p-[6px] top-[20px] right-[105px] bg-gray-600 rounded-full"><TrashIcon className="w-5 h-5" /></button>
                        {conf2 && <Confirmar titulo="Tem certeza que deseja excluir?" texto="Voce está preste a deletar essa experiência para sempre, essa ação não poderá ser desfeita" func={() => excluir()} close={() => setConf2(false)} />}
                    </>}
                    {data ? (
                        <>
                            <p className="text-white pb-4 font-bold">Usuário {data.id_user}</p>
                            <p className="text-white">{data.texto}</p>
                            <hr className="my-6 border-white" />
                            <p className="text-white">{data.contexto}</p>
                            <hr className="my-6 border-white" />
                            <div className='flex flex-wrap gap-2'>
                                {data.tags.map((t, index) => (
                                    <p key={index} className="text-white bg-white/10 px-3 py-1 rounded-full">
                                        {t}
                                    </p>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-white">Carregando...</p>
                    )}
                </> : <>
                    <button onClick={() => {editar(); onClose()}} className="absolute text-white font-bold p-[6px] top-[20px] right-[16px] bg-gray-600 rounded-full"><CheckIcon className="w-6 h-6 text-green-600" /></button>
                    <button onClick={() => setConf3(true)} className="absolute text-white font-bold p-[3px] top-[20px] right-[60px] bg-gray-600 rounded-full"><XMarkIcon  className="w-7 h-7 text-red-400" /></button>
                    {conf3 && <Confirmar titulo="Cancelar alterações?" texto="Todas as alterações feitas serão descartadas, essa ação não poderá ser desfeita" func={onClose} close={() => setConf3(false)} />}
                    {data ? (
                        <>
                            <p className="text-white pb-4 font-bold">{id ? "Editar experiência" : "Nova experiência"}</p>
                            <textarea onChange={(e) => setTextoEdit(e.target.value)} value={textoEdit} ref={ref[0]} onInput={e => textareaConfig(e)} placeholder='Sua experiência' className="focus:outline-none text-white bg-transparent w-full overflow-hidden resize-none" rows={1} />
                            <hr className="my-6 border-white" />
                            <textarea onChange={(e) => setContextoEdit(e.target.value)} value={contextoEdit} ref={ref[1]} onInput={e => textareaConfig(e)} placeholder='Contexto da experiência' className="focus:outline-none text-white bg-transparent w-full overflow-hidden resize-none" rows={1} />
                            <hr className="my-6 border-white" />
                            <div className='flex flex-wrap gap-2'>
                                {tagEdit.map((t, index) => (
                                    <p key={index} onClick={() => { setTagEdit(tagEdit.filter(item => item !== tagEdit[index])) }} className="hover:bg-red-500 cursor-pointer text-white bg-white/10 px-3 py-1 rounded-full">
                                        {t}
                                    </p>
                                ))}
                            </div>
                            <div className='flex justify-center item-center'>
                                <input value={tagText} onChange={(e) => {if(!(e.target.value.endsWith(',') || e.target.value.endsWith(' ')))setTagText(e.target.value)}} onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ',' || e.key === ' '){addTag(); setTagText('');}}} placeholder='Adicionar tag' className={`bg-white/10 rounded-full py-[5px] mt-[8px] w-full h-full text-white px-4 mr-[10px] focus:outline-none`} />
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