import { useState, useEffect } from 'react'

function CardModal({ id, onClose }: { id: number; onClose: () => void }){

    const [data, setData] = useState(null);

    useEffect(() => {
        const buscar = async () => {
            const res = await fetch('/mock/xp.json');
            const json = await res.json();
            setData(json.find(xp => xp.id === id));
        }
        
        buscar();
    }, [])

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[rgb(100,100,100)] p-8 rounded-lg w-[600px]">
                <button onClick={onClose} className="text-white font-bold float-right">X</button>
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
            </div>
        </div>
    );

}

export default CardModal