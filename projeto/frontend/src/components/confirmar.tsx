import { useEffect, useState } from 'react'
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

function Confirmar({ titulo, texto, close, func }: {titulo: string, texto: string, close: () => void, func: () => void}){

    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const mudar = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", mudar);
        return () => window.removeEventListener("resize", mudar);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-[rgb(100,100,100)] p-4 rounded-lg max-w-[400px]">
                <div className='flex flex-col justify-center items-center'>
                    <p className='text-white font-bold py-[10px] text-[15pt] text-center'>{titulo}</p>
                    <p className='text-white py-[5px] text-[12pt] text-center'>{texto}</p>
                    <div className='flex justify-center items-center w-full py-[20px]'>          
                        <button onClick={() => close()} className="transition-all w-[50px] h-[50px] mx-[30px] border-[3px] rounded-[8px] border-red-300 hover:bg-[rgb(80,80,80)]"><XMarkIcon  className="text-red-300 w-full h-7" /></button>
                        <button onClick={() => {func(); close()}} className="transition-all w-[50px] h-[50px] mx-[30px] border-[3px] rounded-[8px] border-green-500 hover:bg-[rgb(80,80,80)]"><CheckIcon  className="text-green-500 w-full h-7" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmar