import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Rodape(){
    return (
        <div className="relative w-full bg-[rgb(40,40,40)] shadow-xl min-h-[150px] h-[20vh] md:h-[20vh] z-50 text-sm md:text-lg">
            <div className='flex h-full flex-col'>
                <div className='flex items-center justify-around px-[10vw] lg:px-[35vw] w-full h-full'>

                    {/* Botão GitHub */}
                    <a href="https://github.com/Sr-Husky" target="_blank" rel="noopener noreferrer">
                        <FaGithub className='text-white text-[20px]' />
                        <p className='text-white ml-[-18px]'>GitHub</p>
                    </a>

                    {/* Botão Linkedin */}
                    <a href="https://www.linkedin.com/in/jean-paulo-/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className='text-white text-[20px]' />
                        <p className='text-white ml-[-23px]'>LindedIn</p>
                    </a>
                </div>
                <div className="flex flex-col w-full justify-end pb-[1vh] text-white italic">
                    <p className="text-center">Projeto desenvolvido por Jean Paulo como portfólio pessoal.</p>
                    <p className="text-center">XP Library — © 2025 Jean Paulo. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    )
}

export default Rodape