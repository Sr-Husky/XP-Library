import CardModal from './cardModal'
import { useState } from 'react'

function Card(props: {card_id: number, titulo: string, texto: string, style?: string, styleText?: string, onHover?: (e: boolean) => void}){

    const [mostraModal, setMostraModal] = useState(false);

    return (
        <>
            <div 
                onMouseLeave={() => {props.onHover && props.onHover(false)}}
                onMouseOver={() => {props.onHover && props.onHover(true)}}
                onClick={() => {props.card_id && setMostraModal(true)}}
                className={`m-4 bg-[rgb(80,80,80)] text-md hover:bg-[rgb(100,100,100)] hover:mt-[10px] h-[300px] rounded-xl p-4 transition-all cursor-pointer w-[305px] ${props.style}`}
            >
                <p className={`text-white pb-4 font-bold ${props.styleText}`}>{props.titulo}</p>
                <p className={`line-clamp-[9] text-white ${props.styleText}`}>{props.texto}</p>
            </div>
            {mostraModal && (
                <CardModal id={props.card_id} onClose={() => setMostraModal(false)} />
            )}
        </>
    )

}

export default Card