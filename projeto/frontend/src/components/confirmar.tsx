import Botao from './botao'

function Confirmar({ titulo, texto, close, func }: {titulo: string, texto: string, close: () => void, func: () => void}){
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-[rgb(100,100,100)] p-4 rounded-lg max-w-[400px]">
                <div className='flex flex-col justify-center items-center'>
                    <p className='text-white font-bold py-[10px] text-[15pt] text-center'>{titulo}</p>
                    <p className='text-white py-[5px] text-[12pt] text-center'>{texto}</p>
                    <div className='flex justify-center items-center w-full py-[20px]'>
                        <Botao texto='Cancelar' onClick={() => close()} style='w-[150px] h-[45px] mx-[10px] border-[3px] border-red-400' styleTexto='text-[15pt] text-red-300' />
                        <Botao texto='Confirmar' onClick={() => {func(); close()}} style='w-[150px] h-[45px] mx-[10px] border-green-500' styleTexto='text-[15pt] text-green-500' />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Confirmar