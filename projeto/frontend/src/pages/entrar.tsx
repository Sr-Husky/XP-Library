import { useState, useEffect } from 'react'
import Card from '../components/card'
import EditBox from '../components/editBox'
import Botao from '../components/botao'
import { useNavigate } from "react-router-dom";

function Entrar(){

    const [onHoverCard, setOnHoverCard] = useState<boolean>(false);
    const [selecao, setSelecao] = useState<'login' | 'cadastro' | ''>('');
    const [usuario, setUsuario]  = useState<string>('');
    const [email, setEmail]  = useState<string>('');
    const [senha, setSenha]  = useState<string>('');
    const [data, setData]  = useState(null);
    const [usuarioRed, setUsuarioRed] = useState<boolean>(false);
    const [emailRed, setEmailRed] = useState<boolean>(false);
    const [senhaRed, setSenhaRed] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('')
    const navigate = useNavigate();

    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const mudar = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", mudar);
        return () => window.removeEventListener("resize", mudar);
    }, []);

    useEffect(() => {
        const func = async () => {
            const res = await fetch('/mock/users.json');
            const json = await res.json();
            setData(json);
        }
        func();
    }, [])

    function handleEnterPress() {
        if(selecao == 'login') login();
        else cadastro();
    }

    function validaEmail(){
        if(email.includes('@')){
            const [e,d] = email.split('@');
            if(!d.includes('.')) return false; // Dominio tem que ter '.'
            const dd = d.split('.');
            if(!(/^[a-zA-Z0-9_\-.\+]+$/.test(e))) return false; // Tem que ser alphanum ou +, -, _, .
            if(e.startsWith('.') || e.endsWith('.') || e.includes('..')) return false; // Não pode começar/terminar com . ou ter dois . seguidos
            if(d.startsWith('.') || d.endsWith('.') || d.includes('..')) return false; // Não pode começar/terminar com . ou ter dois . seguidos
            if(!(/^[a-zA-Z0-9\-.]+$/.test(d))) return false; // Tem que ser alphanum ou -, .
            if(d.startsWith('-') || d.endsWith('-')) return false; // Não pode começar/terminar com -
            for (let x=1; x<dd.length; x++) {
                if (dd[x].length < 2) return false; // As partes do dominios (exceto a primeira) tem que ser >=2
            }
        } else return false;
        return true;
    }

    function login(){
        let valido = true; let user;
        if(!validaEmail()) {setMsg("Digite um email válido"); setEmailRed(true); valido=false;}
        else { 
            user = data.find((e) => e.email === email);
            if(!user) {setMsg("Usuário não registrado"); setEmailRed(true); valido=false;}
            if(user) if(user.senha != senha) {setMsg("Senha incorreta"); setSenhaRed(true); valido=false;}
            if(valido){
                localStorage.setItem("usuario", JSON.stringify(user));
                navigate('/me');
            }
        }
    }

    function cadastro(){
        let valido = true;
        if(!usuario) {setMsg("Digite seu nome de usuário"); setUsuarioRed(true);}
        else if(!validaEmail()) {setMsg("Digite um email válido"); setEmailRed(true); valido=false;}
        else {
            if(data.find((e) => e.email === email)) {setMsg("Usuário já foi registrado"); setEmailRed(true); valido=false;}
            else if(senha.length < 8) {setMsg("A senha deve conter no mínimo 8 caracteres"); setSenhaRed(true); valido=false;}
            if(valido){
                setMsg("Usuário cadastrado");
                setUsuario('');
                setEmail('');
                setSenha('');
            }
        }
    }

    function resetStyle(){
        setMsg('');
        setUsuarioRed(false);
        setEmailRed(false);
        setSenhaRed(false);
    }
    
    function campo(){
        if(selecao === '') return (<p className={`text-white text-[2.5vw] md:text-[1.5vw] lg:text-[1vw]`}>Faça login ou cadastre-se escolhendo um card</p>);
        else if(selecao === 'login'){
            return (
                <div className='flex flex-col items-center justify-center gap-[1vw] md:gap-[0.5vw]'>
                    <p className={`text-white text-[3vw] md:text-[2vw]`}>Login</p>
                    <EditBox onFocus={() => resetStyle()} rotulo='Digite seu email' value={email} onChange={setEmail} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${emailRed && "border-[3px] border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${emailRed && "text-red-400 placeholder:text-red-400"}`} />
                    <EditBox onFocus={() => resetStyle()} rotulo='Digite sua senha' value={senha} onChange={setSenha} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${senhaRed && "border-[3px] border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${senhaRed && "text-red-400 placeholder:text-red-400"}`} />
                    <Botao texto='Entrar' onClick={login} style='w-[16vw] h-[8vw] md:w-[10vw] md:h-[4vw]' styleTexto='text-[2vw] md:text-[1vw]' />
                    {msg && <p className='text-[1.5vw] md:text-[0.8vw] text-white bg-red-600 rounded-full px-[1vw] p-[0.3vw] mb-[-3vw] mt-[0.7vw]'>{msg}</p>}
                </div>
            )
        } else {
            return (
                <div>
                    <div className='flex flex-col items-center justify-center gap-[1vw] md:gap-[0.5vw]'>
                        <p className='text-white text-[3vw] md:text-[2vw]'>Cadastro</p>
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite seu nome de usuário' value={usuario} onChange={setUsuario} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${usuarioRed && "border-[3px] border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${usuarioRed && "text-red-400 placeholder:text-red-400"}`} />
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite seu email' value={email} onChange={setEmail} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${emailRed && "border-[3px] border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${emailRed && "text-red-400 placeholder:text-red-400"}`} />
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite sua senha' value={senha} onChange={setSenha} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${senhaRed && "border-[3px] border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${senhaRed && "text-red-400 placeholder:text-red-400"}`} />
                        <Botao texto='Entrar' onClick={cadastro} style='w-[16vw] h-[8vw] md:w-[10vw] md:h-[4vw]' styleTexto='text-[2vw] md:text-[1vw]' />
                        {msg && <p className={`text-[1.5vw] md:text-[0.8vw] text-white rounded-full px-[1vw] p-[0.3vw] mb-[-3vw] mt-[0.7vw] bg-green-600 ${(usuarioRed || emailRed || senhaRed) && "bg-red-600"}`}>{msg}</p>}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`mt-[8vh]`}>
            {size.width >= 1200 ?
                <div className="flex w-full justify-center p-4">
                    <div onClick={() => {resetStyle(); (selecao === 'cadastro' || selecao === '') ? setSelecao('login') : setSelecao('');}} className={`flex items-center pr-[3.5vw] transition-all`}>
                        <Card card_id={0} titulo='Login' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[14.6vw] h-[14.5vw] justify-center ${selecao === 'cadastro' && "bg-[rgb(50,50,50)]"} ${selecao === 'login' && "border border-white"}`} styleText={`text-[1vw] ${selecao === 'cadastro' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>
                    <div className={`flex justify-center items-center max-w-[700px] w-[40vw] h-[25vw] bg-[rgb(60,60,60)] rounded-[5vw] mx-[-0.5vw] transition-all ${selecao === 'login' && "ml-[-4vw]"} ${selecao === 'cadastro' && "mr-[-4vw]"} ${(onHoverCard || selecao !== '') && "border border-white"}`}>
                        {campo()}
                    </div>
                    <div onClick={() => {resetStyle();(selecao === 'login' || selecao === '') ? setSelecao('cadastro') : setSelecao('');}} className={`flex items-center ml-[3.5vw] transition-all`}>
                        <Card card_id={0} titulo='Cadastro' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[14.6vw] h-[14.5vw] justify-center ${selecao === 'login' && "bg-[rgb(50,50,50)]"} ${selecao === 'cadastro' && "border border-white"}`} styleText={`text-[1vw] ${selecao === 'login' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>
                </div> :
                <div className="flex flex-wrap w-full justify-center p-4">
                    <div className={`flex justify-center items-center max-w-[1000px] w-[80vw] h-[400px] bg-[rgb(60,60,60)] rounded-[5vw] my-[-2.5vw] sm:my-[-2vw] md:my-[-1.5vw] lg:my-[-1vw] ${(onHoverCard || selecao !== '') && "border border-white"}`}>
                        {campo()}
                    </div>
                    <div onClick={() => {resetStyle(); (selecao === 'cadastro' || selecao === '') ? setSelecao('login') : setSelecao('');}} className={`flex pt-[5vw] items-center transition-all ${selecao === 'login' && "pt-[0vw] mb-[3vw]"}`}>
                        <Card card_id={0} titulo='Login' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[30vw] h-[30vw] justify-center ${selecao === 'cadastro' && "bg-[rgb(50,50,50)]"} ${selecao === 'login' && "border border-white hover:mt-[16px]"}`} styleText={`text-[2vw] ${selecao === 'cadastro' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>
                    <div onClick={() => {resetStyle(); (selecao === 'login' || selecao === '') ? setSelecao('cadastro') : setSelecao('');}} className={`flex pt-[5vw] items-center transition-all ${selecao === 'cadastro' && "pt-[0vw] mb-[3vw]"}`}>
                        <Card card_id={0} titulo='Cadastro' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[30vw] h-[30vw] justify-center ${selecao === 'login' && "bg-[rgb(50,50,50)]"} ${selecao === 'cadastro' && "border border-white hover:mt-[16px]"}`} styleText={`text-[2vw] ${selecao === 'login' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>
                </div>
            }
        </div>
    )
}

export default Entrar