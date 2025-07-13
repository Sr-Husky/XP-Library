import CardModal from './cardModal'
import { useState } from 'react'
import { HandThumbUpIcon } from "@heroicons/react/24/solid";

function Card(props: {card_id: number, titulo: string, like?: number, texto: string, style?: string, styleText?: string, onHover?: (e: boolean) => void, fav?: boolean}){

    // Modal do card
    const [mostraModal, setMostraModal] = useState(false);

    return (
        <>
            {/* onMouseLeave: onHover(false), onMouseOver: onHover(true), onClick: setMostraModal(true) */}
            <div onMouseLeave={() => {props.onHover && props.onHover(false)}} onMouseOver={() => {props.onHover && props.onHover(true)}} onClick={() => {props.card_id && setMostraModal(true)}} className={`m-4 bg-[rgb(80,80,80)] text-md hover:bg-[rgb(100,100,100)] hover:mt-[10px] h-[300px] rounded-xl p-4 transition-all cursor-pointer w-[305px] ${props.style}`}>
                {/* Botão de like e quantidade (usa operador ternario para não escrever na tela) */}
                {Boolean(props.card_id) &&
                    <div className='relative w-full'>
                        <HandThumbUpIcon className="absolute text-white w-6 h-6 right-[0px]" />
                        <p className='absolute text-white w-6 h-6 right-[25px]'>{props.like}</p>
                    </div>
                }
                {/* Titulo e texto */}
                <p className={`text-white pb-4 font-bold ${props.styleText}`}>{props.titulo}</p>
                <p className={`line-clamp-[9] text-white ${props.styleText}`}>{props.texto}</p>
            </div>
            {mostraModal && (
                <CardModal id={props.card_id} onClose={() => setMostraModal(false)} fav={props.fav} />
            )}
        </>
    )

}

export default Card