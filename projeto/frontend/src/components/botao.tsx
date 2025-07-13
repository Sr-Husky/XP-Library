function Botao({ texto, onClick, style, styleTexto }: {texto: string, onClick: () => void, style?: string, styleTexto?: string}){
    return (
        // onClick: chama onClick()
        <div onClick={onClick} className={`flex justify-center items-center max-w-[150px] max-h-[50px] h-[4vw] w-[10vw] border border-white bg-trasparent cursor-pointer rounded-[5vw] hover:border-[3px] hover:font-bold hover:bg-[rgb(80,80,80)] ${style}`}>
            <p className={`text-white text-[1vw] ${styleTexto}`}>{texto}</p>
        </div>
    )
}

export default Botao