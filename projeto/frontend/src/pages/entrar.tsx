import { useState, useEffect } from 'react'
import Card from '../components/card'
import EditBox from '../components/editBox'
import Botao from '../components/botao'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { userLogin, userCad, deslogar } from "../services/userService"

function Entrar( {navMsg, limpaNavMsg}: { navMsg: string, limpaNavMsg: () => void} ){

    const [onHoverCard, setOnHoverCard] = useState<boolean>(false); // Variável para animação do mouse em cima do card
    const [selecao, setSelecao] = useState<'login' | 'cadastro' | ''>(''); // Variável para guardar a opção selecionada
    const [usuario, setUsuario]  = useState<string>(''); // Variável que controla o campo "usuário"
    const [email, setEmail]  = useState<string>(''); // Variável que controla o campo "email"
    const [senha, setSenha]  = useState<string>(''); // Variável que controla o campo "senha"
    const [usuarioRed, setUsuarioRed] = useState<boolean>(false); // Variável que deixa o campo "usuário" vermelho em caso de erro
    const [emailRed, setEmailRed] = useState<boolean>(false); // Variável que deixa o campo "email" vermelho em caso de erro
    const [senhaRed, setSenhaRed] = useState<boolean>(false); // Variável que deixa o campo "senha" vermelho em caso de erro
    const [msg, setMsg] = useState<string>('') // Variável que mostra a mensagem do erro
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight }); // Variáveis para quardar tamanho da tela
    const { contextLogin, contextLogout } = useAuth();
    const navigate = useNavigate();

    // Recebe mensagem da navBar para fazer logout
    useEffect(() => {
        if(navMsg){
            if(navMsg === "logout"){
                deslogar();
                contextLogout();
                limpaNavMsg()
            }
        }
    }, [navMsg])

    // Atualiza as variáveis do tamanho da tela
    useEffect(() => {
        const mudar = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", mudar);
        return () => window.removeEventListener("resize", mudar);
    }, []);

    // Chama a função corespondente a opção selecionada
    function handleEnterPress() {
        if(selecao == 'login') login();
        else cadastro();
    }

    // Valida se o email tem a sintaxe correta
    function validaEmail(){
        if(email.includes('@')){ // Precisa ter '@'
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

    // Tenta fazer login
    const login = async () => {
        if(!validaEmail()) {setEmailRed(true); return setMsg("Digite um email válido");} // Testa a sintaxe do email
        const res = await userLogin(email, senha); // Coleta dados da API
        if(res === 404) {setEmailRed(true); return setMsg("Usuário não registrado");} // Erro caso o email não seja encontrado no banco de dados
        if(res === 401) {setSenhaRed(true); return setMsg("Senha incorreta");} // Erro caso a senha não seja a mesma atribuida ao email
        if(!res) return setMsg("Erro desconhecido, tente novamente");  // Qual outro erro (rede, etc)
        contextLogin(res.user, res.access_token, res.refresh_token);
        navigate('/me');
    }

    // Faz o cadastro
    const cadastro = async () => {
        if(!usuario) {setUsuarioRed(true); return setMsg("Digite seu nome de usuário");} // Verifica se o usuário foi digitado
        if(!validaEmail()) {setEmailRed(true); return setMsg("Digite um email válido");} // Testa a sintaxe do email
        if(senha.length < 8) {setSenhaRed(true); return setMsg("A senha deve conter no mínimo 8 caracteres");} // Verifica se o tamanho da senha é >= 8

        // Chamanda do serviço
        const res = await userCad({
            usuario: usuario,
            email: email,
            senha: senha,
            data: new Date().toISOString(),
            logado: false,
            like: []
        });

        // Verifica se o usuário já foi registrado
        if(res === 409) {setEmailRed(true); return setMsg("Usuário já foi registrado");}
        setMsg("Usuário cadastrado");
        setUsuario('');
        setEmail('');
        setSenha('');
    }

    // Volta os estilo das editBox para o padrão quando elas recebem o foco
    function resetStyle(){
        setMsg('');
        setUsuarioRed(false);
        setEmailRed(false);
        setSenhaRed(false);
    }
    
    // Retorna o trecho de codigo com os botões correspondentes a opção escolhida
    function campo(){
        // Se nada for selecionado
        if(selecao === '') return (<p className={`text-white text-[2.5vw] md:text-[2vw] lg:text-[1.2vw]`}>Faça login ou cadastre-se escolhendo um card</p>);

        // Se for selecionado "login"
        else if(selecao === 'login'){
            return (
                <div className='flex flex-col transition-all items-center justify-center gap-[1vw] md:gap-[0.5vw]'>
                    <p className={`text-white text-[3vw] md:text-[2vw]`}>Login</p>
                    <EditBox onFocus={() => resetStyle()} rotulo='Digite seu email' value={email} onChange={setEmail} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${emailRed && "border-[3px] [&:not(:focus)]:border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${emailRed && "[&:not(:focus)]:text-red-400 placeholder:text-red-400"}`} />
                    <EditBox onFocus={() => resetStyle()} rotulo='Digite sua senha' value={senha} onChange={setSenha} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${senhaRed && "border-[3px] [&:not(:focus)]:border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${senhaRed && "[&:not(:focus)]:text-red-400 placeholder:text-red-400"}`} />
                    <Botao texto='Entrar' onClick={login} style='w-[16vw] h-[8vw] md:w-[10vw] md:h-[4vw]' styleTexto='text-[2vw] md:text-[1vw]' />
                    {msg && <p onClick={() => console.log("emailRed: ", emailRed)} className='text-[1.5vw] md:text-[0.8vw] text-white bg-red-600 rounded-full px-[1vw] p-[0.3vw] mb-[-3vw] mt-[0.7vw]'>{msg}</p>}
                </div>
            )

        // Se for selecionado "cadastro"
        } else {
            return (
                <div>
                    <div className='flex flex-col transition-all items-center justify-center gap-[1vw] md:gap-[0.5vw]'>
                        <p className='text-white text-[3vw] md:text-[2vw]'>Cadastro</p>
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite seu nome de usuário' value={usuario} onChange={setUsuario} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${usuarioRed && "border-[3px] [&:not(:focus)]:border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${usuarioRed && "[&:not(:focus)]:text-red-400 placeholder:text-red-400"}`} />
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite seu email' value={email} onChange={setEmail} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${emailRed && "border-[3px] [&:not(:focus)]:border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${emailRed && "[&:not(:focus)]:text-red-400 placeholder:text-red-400"}`} />
                        <EditBox onFocus={() => resetStyle()} rotulo='Digite sua senha' value={senha} onChange={setSenha} onEnter={handleEnterPress} style={`max-w-[600px] w-[70vw] h-[8vw] md:w-[60vw] md:h-[6vw] lg:w-[28vw] lg:h-[4vw] xl:w-[30vw] xl:h-[3vw] ${senhaRed && "border-[3px] [&:not(:focus)]:border-red-600"}`} styleInput={`text-[3vw] md:text-[1.5vw] lg:text-[1vw] ${senhaRed && "[&:not(:focus)]:text-red-400 placeholder:text-red-400"}`} />
                        <Botao texto='Cadastrar' onClick={cadastro} style='w-[16vw] h-[8vw] md:w-[10vw] md:h-[4vw]' styleTexto='text-[2vw] md:text-[1vw]' />
                        {msg && <p className={`text-[1.5vw] md:text-[0.8vw] text-white rounded-full px-[1vw] p-[0.3vw] mb-[-3vw] mt-[0.7vw] bg-green-600 ${(usuarioRed || emailRed || senhaRed) && "bg-red-600"}`}>{msg}</p>}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`mt-[8vh]`}>

            {/* Tela grande */}
            {size.width >= 1200 ? <>
                <div className="flex w-full justify-center p-4">
                    {/* Botão para selecionar 'Login' */}
                    <div onClick={() => {resetStyle(); (selecao === 'cadastro' || selecao === '') ? setSelecao('login') : setSelecao('');}} className={`flex items-center pr-[3.5vw] transition-all`}>
                        <Card card_id={0} titulo='Login' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[14.6vw] h-[14.5vw] justify-center ${selecao === 'cadastro' && "bg-[rgb(50,50,50)]"} ${selecao === 'login' && "border border-white"}`} styleText={`text-[1vw] ${selecao === 'cadastro' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>

                    {/* Campo para exibir as editBox */}
                    <div className={`flex justify-center items-center max-w-[700px] w-[40vw] h-[25vw] bg-[rgb(60,60,60)] rounded-[5vw] mx-[-0.5vw] transition-all ${selecao === 'login' && "ml-[-4vw]"} ${selecao === 'cadastro' && "mr-[-4vw]"} ${(onHoverCard || selecao !== '') && "border border-white"}`}>
                        {campo()}
                    </div>

                    {/* Botão para selecionar 'Cadastro' */}
                    <div onClick={() => {resetStyle();(selecao === 'login' || selecao === '') ? setSelecao('cadastro') : setSelecao('');}} className={`flex items-center ml-[3.5vw] transition-all`}>
                        <Card card_id={0} titulo='Cadastro' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[14.6vw] h-[14.5vw] justify-center ${selecao === 'login' && "bg-[rgb(50,50,50)]"} ${selecao === 'cadastro' && "border border-white"}`} styleText={`text-[1vw] ${selecao === 'login' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                    </div>
                </div> 
            
            {/* Tela pequena */}
            </> : <>
                <div className="flex flex-col w-full items-center justify-center p-4">
                    {/* Campo para exibir as editBox */}
                    <div className={`flex justify-center items-center max-w-[1000px] w-[80vw] h-[400px] bg-[rgb(60,60,60)] rounded-[5vw] my-[-2.5vw] sm:my-[-2vw] md:my-[-1.5vw] lg:my-[-1vw] ${(onHoverCard || selecao !== '') && "border border-white"}`}>
                        {campo()}
                    </div>

                    <div className='flex flex-wrap w-full justify-center'>
                        {/* Botão para selecionar 'Login' */}
                        <div onClick={() => {resetStyle(); (selecao === 'cadastro' || selecao === '') ? setSelecao('login') : setSelecao('');}} className={`flex pt-[5vw] items-center transition-all ${selecao === 'login' && "mt-[-10vw]"}`}>
                            <Card card_id={0} titulo='Login' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[30vw] h-[30vw] justify-center ${selecao === 'cadastro' && "bg-[rgb(50,50,50)]"} ${selecao === 'login' && "border border-white hover:mt-[16px]"}`} styleText={`text-[2vw] ${selecao === 'cadastro' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                        </div>

                        {/* Botão para selecionar 'Cadastro' */}
                        <div onClick={() => {resetStyle(); (selecao === 'login' || selecao === '') ? setSelecao('cadastro') : setSelecao('');}} className={`flex pt-[5vw] items-center transition-all ${selecao === 'cadastro' && "mt-[-10vw]"}`}>
                            <Card card_id={0} titulo='Cadastro' texto='' style={`flex flex-wrap items-center max-w-[305px] max-h-[300px] w-[30vw] h-[30vw] justify-center ${selecao === 'login' && "bg-[rgb(50,50,50)]"} ${selecao === 'cadastro' && "border border-white hover:mt-[16px]"}`} styleText={`text-[2vw] ${selecao === 'login' && "text-[rgb(180,180,180)]"}`} onHover={setOnHoverCard} />
                        </div>
                    </div>
                </div>
            </>}
        </div>
    )
}

export default Entrar