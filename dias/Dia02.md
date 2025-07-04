# Dia 02 – **Configuração do Front-end**

**Data:** 02/07/2025

## ✏ O que eu estudei hoje

- #### Docker compose
	- Arquivo docker-compose.yml
		- É um arquivo que servirá para iniciar todos os containers juntos, sem ele eu precisaria dar um "docker run" em cada um separadamente, com ele eu só precisa usar o "docker-compose up".
	- Estrutura do docker-compose.yml
		- services: é onde eu coloco cada container, do front, back, nginx, banco de dados, etc
		- build: é o onde eu vou colocar o caminho para o dockerfile, que vai ter as instruções para construir a imagem do container
		- image: serve para especificar uma imagem já pronta, caso eu queira
		- ports: é onde eu vou mapear as portas para cada container
		- volumes: mapeia os diretórios do meu pc para o container
		- depends_on: define a ordem de inicialização entre os container
		- networks: conectar os containers
	- A estrutura que eu espero é composta por 5 containers:
		- front-end: Vite + React
		- back-end: NestJS + Prisma
		- db: PostgreSQL
		- pgadmim: Para gerenciar o banco de dados
		- nginx: Proxy reverso
	
- #### Npm
	- Significa Node Package Manager, é oque eu vou usar para instalar tudo que é referente a pacotes do node como react, vite, tailwind, etc.
	- Ele também ira criar o arquivo "package.json" que é o arquivo que controla as dependências do projeto
	
- #### Vite
	- O vite é uma ferramenta de build, preciso dele pois estou usando react, assim como eu preciso compilar um código cpp para um executável binário para que o computador possa interpretar corretamente, eu também preciso passar os arquivos no formato do react para algo que o navegador possa interpretar. React é composto por arquivo .jsx que possuem sua sintaxe própria, e isso precisa ser convertido para HTML + JS padrão pro navegador, isso é "fazer o build", geralmente o build é feito para uma pasta chamada "dist"
	- Além disso o vite também levanta um servidor para hospedar o site, por padrão na porta 5173, com recarregamento automático, acho que eu vou precisar ajustar algo em relação isso no docker composer, ou talvez não, acho que a porta que eu defini (3000) já vai estar servindo o meu front, só tenho que ver como eu programo o container docker para servir especificamente o build do meu front
	
- #### Tailwind CSS
	- É um framework utilitário que vai facilitar na hora de estilizar o meu front-end, eu ia usar bootstrap que é algo que eu já estava mais habituado, mas eu preferi aprender como posso usar esse framework pois eu não quero que fique tudo com "cara de bootstrap", e aparentemente esse framework me dá muito mais liberdade criativa, isso tudo dentro do próprio HTML, porque eu posso colocar os estilos apenas especificando uma classe pro componente, ex: `<button className="bg-blue-500 text-white p-2 rounded">`
	- Aparentemente tem algumas coisas que eu preciso arrumar no arrumar para integrar ele com meu projeto, para ser algo bem fixo, sem nada que eu precise realmente "aprender", então o procedimento vai ser olhar um modelo de como deve ficar e ajustar tudo certinho
	
- #### Fluxo de criação do esqueleto do front-end
	- `npm create vite@latest`
		- Serve para criar o projeto vite, escolhi as opções React e Typescript para o projeto, o nome do projeto é "frontend", uma pasta com esse nome e dentro dela tem aquele arquivo que mencionei anteriormente "package.json"
	- `npm install`
		- Dentro da pasta "frontend" que foi criada, eu preciso usar esse comando para instalar as dependências a partir do "package.json"
	- `npm install -D tailwindcss@3 postcss autoprefixer`
		- Fiquei mais ou menos uma hora tentando usar a versão mais atual do tailwind (versão 4), mas por algum motivo ela não está funcionando corretamente, por isso estou usando a versão 3 (dica que vi de um gringo do github) que parece mais estável e com mais um melhor suporte.
		- O parâmetro -D serve para adicionar o tailwind como um requisito de desenvolvimento, então ele será considerado algo necessario apenas no desenvolvimento e não entrará para a versão de build
		- O "postcss" é oque chamam de "processador de css", ele vai ler os @tailwind (`base`, `components`, `utilities`) que eu vou importar no meu arquivo css e vai expandir isso em muuuitas classes de css, porem apenas as classe que estou usando
		- O "autoprefixer" é um plugin do postcss que serve para expandir a compatibilidade entre os navegadores
	- `npx tailwindcss init -p`
		- "npx" significa "Node Package Execute", ele serve para executar pacotes que estão no meu projeto sem precisar instalar globalmente, esse comando para o tailwind serve para criar dois arquivos que vou precisar para configura-lo, são eles: "tailwind.config.js" e "postcss.config.js" (o parâmetro -p é justamente para incluir o postcss.config.js)

- #### Funcionamento do Tailwindcss
	- O tailwind vai gerenciar todos os estilos do meu app, ele é configurado pelo arquivo "tailwind.config.js", nesse arquivo voce especifica 3 propriedades: "content", "theme" e "plugins". A parte de theme e plugins eu não sei como funciona, acho que não irei precisar por enquanto, já a propriedade "content" é onde voce especifica os diretórios que o tailwind vai procurar e modificar o css
	- Nos arquivos que estiverem especificados, voce irá usar o "@tailwind" que é uma extensão criada pelo próprio tailwind, com é ele que vai gerenciar esses arquivos css eu não preciso de me preocupar com a sintaxe que o interpretador css com certeza não reconheceria, pois o arquivo final vai ser gerado pelo tailwind com todas as classes css que eu quis usar no meu código e com a sintaxe aceita pelo css
	- Eu vou usar o "@tailwind base" para importar os estilos base do tailwind que é pra servir como um reset de estilos, como um "normalize.css" que é um arquivo que defini tudo com os estilos padrões, mas no caso isso será feito pelo tailwind
	- Depois voce usa o "@tailwind components", que importa os componentes reutilizáveis definidos pelo tailwind e pelos plugins (aparentemente isso é uma funcionalidade dos plugins que eu posso definir no tailwind.config), componentes como .btn, .card, etc, e também todo "@layer components" que eu adicionar (nunca usei isso mas vou ver do que se trata)
	- E por fim agora vem o mais importante que são as classes de estilo usando o comando "@tailwind utilities", que é quando ele vai finalmente importar todos as classes com os estilos que voce vai usar no código, tipo o .text-red-500, bg-blue-600 (ainda tenho que ver quais são as opções de classes que eu posso usar)
	- Tudo tem que estar nessa ordem, pois é nesse ordem que as aplicações são feitas, e é claro que ao final ele tem que sobrescrever todos os estilos com os estilos que voce definiu nas classes, ate mesmo os estilos dos componentes reutilizáveis do próprio tailwind (por isso os componentes vem antes)
	- Ao usar "npm run dev", ele ira processar os arquivos css, irá buscar automaticamente o arquivo "postcss.config.js" que é o arquivo que irá especificar os plugins usados para processar os arquivos css, que no caso são os plugins tailwind() e o autoprefixer(), o tailwind vai percorrer todos os diretórios e arquivos especificados no tailwind.config e ira fazer as devidas aplicações, o autoprefixer vai adicionar os prefixos css para a compatibilidade cross-browser, e então ira gerar o arquivo de estilos final que será o arquivo que será de fato usado pela aplicação

- #### Entendendo como tudo funciona na pratica
	- Vite será o framework que vai orquestrar tudo, ele ira criar um servidor local na porta 5173 e ira servir o "index.html", além de é claro converter todos os códigos JSX, TSX e TS para JS puro.
	- No "index.html" nos temos a parte mais estrutural da aplicação, nela voce terá uma div com o id "root", e uma importação de script do "main.tsx"
	- A div com o id "root" irá servir para definir a raiz do React, que é onde o React irá começar a renderizar os componentes. No arquivo main.tsx, através da função "createRoot()" recebendo o elemento com o id "root" via DOM, ele irá chamar a função "render()" e dentro dela é onde estará todos os componentes.
		- O componente \<StrictMode\> é do próprio React, importado pela linha de código "import { StrictMode } from 'react'" e serve para ativar verificações extras e avisos no ambiente de desenvolvimento, também ajuda a detectar más práticas ou códigos desatualizados
			- Essa importação funciona pois o texto 'react' da forma que está, sem ser um diretório, vai ser interpretado pelo vite como um módulo que foi instalado (que está na pasta "node-modules") pelo comando "npm install", então ele já vai buscar lá automaticamente tudo que voce pedir no campo entre as chaves, que no caso é o StrictMode (obs: essa é um "exportação nomeada" que é quando voce usa o prefixo "export" em algum elemento do seu código, pode ser uma função ou uma variável, quando voce não usar as chaves para especificar um "export" especifico para importar, voce estará usando a exportação padrão, por isso no main.jsx nos estamos importando usando "import App from './App.tsx'" pois no App.tsx nos temos um "export default" que será exportada com o nome "App")
		- O componente \<App /\> é o componente principal do React, que está definido no arquivo "App.tsx"

- #### Componentes em React
	- Para criar componente a estrutura é essa:
		- `function App(){return (<> <h1>Hello TS + React<\h1> </>);};`
		- Isso irá criar uma função que ira retornar um JSX.Element
		- Quando eu importo um componente usando "import App from ./App.tsx" e então eu uso `<App />`, essa sintaxe é do tipo .jsx que será convertida para JS, e ficara no tipo "React.createElement()", portanto oque ela espera é justamente um JSX.Element, que também já estará convertido, ou seja, ao colocar o 'App' que voce importou entre os operadores <> voce esta dizendo que ele é um componente e se oque ele retornar não for um componente (JSX.Element) isso resultará num erro
	- Voce também pode usar os "props" (propriedades), que são como se fosse os argumentos de uma função, mas na verdade eles representam as propriedades do componente, quando voce cria uma tag em HTML como `<div id='root' class='raiz'>`, voce está dizendo que a div recebe o atributo "id" e o atributo "class", a mesma logica acontece no React, porem o nome certo é "propriedades", aqui um exemplo de uso:
		- `function Saudacao(props: { nome: string }) {return <h1>Olá, {props.nome}!</h1>}`
			- Essa sintaxe do ":" é a sintaxe de tipagem do Typescript, isso é algo que eu não anotei mas a principal diferença do Typescript é que ele é tipado, ou seja, voce pode escolher os tipos das variáveis, funciona assim: `<nome da variavel>: <tipo>`
			- No exemplo acima eu crio uma variável "props" que tem o tipo "{ nome: string}", esse tipo é como se fosse uma struct em c++, é uma estrutura que tem um atributo chamado "nome", e seguindo a mesma logica de tipagem, esse atributo "nome" tem o tipo string
			- Esse componente pode ser usado assim: `<Saudacao nome="Jean" />
	- Voce também pode pré definir o tipo dos props:
		- `type Props = {nome: string;};`
		- `function Saudacao( props : Props) {return <h1>Oi, {props.nome}!</h1>;}`
			- Aqui eu crio um tipo, usando o prefixo "type" com o nome "Props", como se eu criasse uma struct em c++, então la na função eu so preciso dizer que ela recebera uma variável "props" que será do tipo Props
		- `function Saudacao({ nome } : Props) {return <h1>Oi, {nome}!</h1>;}`
			- Nesse exemplo voce simplifica o processo e já desestrutura o atributo "nome" de Props
	- Eu pensei em definir componentes com props assim (dá errado):
		- `function Saudacao(nome: string) {return <h1>Oi, {nome}!</h1>;}`
			- Isso não funciona porque o componente não pode receber uma string diretamente como argumento, ele sempre tem que receber um objeto com as propriedades possíveis
	- Voce pode definir propriedades opcionais para os componentes
		- `type Props = {nome?: string;};`
		- `function Saudacao({ nome }: Props) {return <h1>Oi, {nome ?? 'visitante'}!</h1>;}`
		- O operador "?" serve para tornar a propriedade opcional, caso voce não passe um valor para aquela propriedade ela fica com o valor "undefined", e no caso do operador "??" ele serve para escrever "Visitante" caso a variável nome esteja undefined
		- `<Saudacao nome="Jean" />    // Exibe: Oi, Jean!`
		- `<Saudacao />                // Exibe: Oi, visitante!`

- #### Rotas com React Router DOM
	- O React Router DOM é a biblioteca oficial de roteamento do React, ele permite que minha aplicação tenha múltiplas páginas. Em uma aplicação convencional sem o react, eu posso simplesmente criar um arquivo .html para cada pagina e então carregar as paginas separadamente, porem aqui no react eu renderizo tudo no body do arquivo "index.html", então se eu quiser mudar de uma pagina pra outra, eu vou ter que mudar na verdade o conteúdo todo do body, é aí que entra o "Router"
	- Primeiramente eu preciso instala-lo com `npm install react-router-dom`
	- Para usar ele é muito fácil, primeiro eu só criei a pasta de páginas "pages", e coloquei um arquivo tsx para cada pagina, sim cada pagina é meio que um componente, então agora após instalar o React Router eu so tenho que importar ele no meu App.tsx (escolhi o App.tsx ao invés do main.tsx por questão de organização, pois agora acho que eu posso deixar uns componentes fixos tipo, o rodapé e o navbar, enquanto eu mudo so a pagina, vamos ver se vai dar certo), eu importo "BrowserRouter", "Routes", e "Route", o componente BrowserRouter server para criar a estrutura de roteamento, o "Routes" para especificar o campo em que vou colocar as rotas, e o "Route" para especificar cada rota, cada Route tem as propriedades "path" e "element", onde "path" é o caminho que eu quero que seja o caminho da pagina, por exemplo, eu quero quero que o caminho "/login" renderize a minha página de login, então mapeio essa rota e na propriedade element eu simplesmente especifico qual é a página (componente) que eu quero carregar, então no caso do login fica `<Route path="/login" element={<Login />}  />` Isso é claro após já ter importado a página para meu código com `import Login from ./pages/login`, e para esse import funcionar como eu já disse eu preciso ter um export padrão no arquivo, então em cada pagina eu adicionei um export default de uma função que retornar um componente React (JSX.Element) que apenas mostra um texto h1 dizendo o nome da página
	- Também coloquei uma rota para caso haja a tentativa de acessar um caminho que não existe, nesses casos ele vai renderizar a pagina "home", isso pode ser feito mapeando a página para a rota "*"
	- Depois tenho que ver melhor sobre oque são hooks, como useNavigate(), useParams() e useLocation(), e também como posso usar rotas aninhadas caso eu precise

- #### Estilização com Tailwind
	- Percebi que estilizar vai ser uma coisa que vai tomar muuito meu tempo, e eu vou ter que tirar um pouco o foco disso, acho que com o tempo eu vou descobrindo formas melhores de estilizar, então o estilo do site provavelmente vai mudar com frequência, enfim, eu criei o esqueleto dos dois componentes fixos (rodapé e barra de navegação), coloquei eles em volta da pagina principal ou seja, eu renderizo o navbar em cima, renderizo a pagina do rota atual no meio, e renderizo o rodapé no final, dessa forma a única parte do site que vai atualizar é o conteúdo central, que é o das paginas de fato, eu fiquei um bom tempo só entendendo e ajustando os estilos, essa parte vai ter que ser só `ctrl + c` / `ctrl + v` mesmo porque isso é algo que eu devo apenas decorar, a única coisa que eu vi que é algo que eu realmente preciso entender a semântica por trás é a questão do posicionamento e a responsividade que parece ser bem personalizável no tailwind.

- #### Responsividade com Tailwind
	- Essa parte eu só tenho que decorar mesmo, preciso saber dos valores de "breakpoins" que associados a cada tipo de estilo, que são:
	- `sm:` (≥ 640px)
	- `md:` (≥ 768px)
	- `lg:` (≥ 1024px)
	- `xl:` (≥ 1280px)
	- `2xl:` (≥ 1536px)
	- Isso significa que, por exemplo, o estilo que vem depois de "sm:" será ativado para telas `>= 640px`


## 💡 O que eu aprendi

✔ Estrutura do Docker Compose
✔ Funcionamento do gerenciador de pacotes do Node
✔ Como funciona o Vite e para que ele serve
✔ Estilização com Tailwind e como ele se integra no projeto
✔ Como estruturar um projeto Vite + React + Tailwind
✔ Fluxo de interação entre todas as partes do projeto até chegar no resultado final
✔ Como os componentes em React são criados e organizados
✔ Sintaxe básica de Typescript
✔ Roteamento com React Router DOM
✔ Implementação simples de responsividade

## 💻 Modificações

* Adicionado .gitignore
* Adicionado docker-compose.yml
	* Container para o front-end
* Criado projeto Vite + React + Typescript
* Feita integração com Tailwind
* Criado esqueleto dos componentes "navbar" e "rodape"
* Criado arquivos de componente das páginas
* Configuradas rotas para cada página
* Mudei o nome da página "minhas-experiencias" para apenas "me"