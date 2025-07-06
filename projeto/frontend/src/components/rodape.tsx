import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Rodape(){
    return (
        <div className="relative w-full bg-[rgb(40,40,40)] shadow-xl h-[20vh] md:h-[20vh] z-50 text-sm md:text-lg">
            <div className='flex h-full flex-col'>
                <div className='flex items-center justify-around px-[10vw] lg:px-[35vw] w-full h-full'>
                    <a href="https://github.com/Sr-Husky" target="_blank" rel="noopener noreferrer">
                        <FaGithub className='text-white text-[20px]' />
                        <p className='text-white ml-[-2vw] xl:ml-[-1vw]'>GitHub</p>
                    </a>
                    <a href="https://www.linkedin.com/in/jean-paulo-/" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className='text-white text-[20px]' />
                        <p className='text-white ml-[-2.5vw] xl:ml-[-1vw]'>LindedIn</p>
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