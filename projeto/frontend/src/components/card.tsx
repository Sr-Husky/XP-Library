import CardModal from './cardModal'
import { useState } from 'react'

function Card(props: {card_id: number, user: string, texto: string}){

    const [mostraModal, setMostraModal] = useState(false);

    return (
        <>
            <div onClick={() => setMostraModal(true)} className="m-4 bg-[rgb(80,80,80)] text-md hover:bg-[rgb(100,100,100)] h-[300px] rounded-xl p-4 transition-all cursor-pointer w-[305px]">
                <p className='text-white pb-4 font-bold'>Usuário {props.user}</p>
                <p className="line-clamp-[9] text-white">{props.texto}</p>
            </div>
            {mostraModal && (
                <CardModal id={props.card_id} onClose={() => setMostraModal(false)} />
            )}
        </>
    )

}

export default Card