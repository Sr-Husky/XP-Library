# Dia 03 –  **Página Inicial + Busca**

**Data:** 03/07/2025

## ✏ O que eu estudei hoje

- #### Componentes que serão criados e suas estruturas
	- Aqui eu cheguei num ponto a falta de conhecimento pode me prejudica um pouco, nos meus planos eu vou fazer o front agora e para simular os dados que eu receberia da API para servir como conteúdo dos componentes, mas eu não sei oque esperar dessa API, eu imagino que vai ser alguma estrutura mais ou menos no formato do objeto de uma classe, de forma que eu poderia me referir a cada um atributo usando "." por exemplo. Enfim, os componentes que vou criar são o "Campo de busca" com os filtros por tags, e os "Cards" que irão aparecer as experiências, mas antes eu preciso ter bem definido oque vai compor esse componentes, no Card por exemplo eu to pensando em fazer algo meio inspirado nos cards do Google Keep. No Keep os Cards possuem um título e um texto, e ao clicar voce tem alguns controles, no caso da minha aplicação eu quero que no Card apareça apenas o texto principal da experiência, e caso o usuário se interesse e clique, o Card seria expandido na tela e mostraria o conteúdo completo com o texto, contexto, controles, tags, data, etc, para isso acho que vou ter que criar dois tipos de visualização para o Card
	- Card: cada card possuirá os dados: "Id", "Id_Usuario", "Texto", "Contexto", "Tags\[\]", "Data_Criacao", "Ultima_Modificacao", "Publico", "Curtidas", por enquanto é isso, então os meus dados mockados dever ter tudo isso, eu vou usar o `fetch()` para carregar os arquivo .json com os dados mockados, que é a mesma função que vou usar para fazer as requisições HTTP. Para isso vou ter que colocar os arquivos na pasta "public".

- #### Estrutura de um .json
	- Voce basicamente escreve um arquivo de classe nele, em que voce especifica os objetos da classe, voce pode usar arrays, objetos, strings, booleanos, números e null
	- `[ {"nome": "Fulano1", "idade": 21}, {"nome": "Fulano2", "idade": 12} ]`
	- O exemplo acima mostra um .json com dois objetos, cada objeto com 2 atributos, "nome" e "idade", nome recebe uma string e idade recebe um numero.
	- Toda chave deve ser uma string

- #### Sobre o fetch()
	- É uma função que retornar um "Promise", que representa um valor que ainda não está disponível, mas vai estar futuramente (ou não), ela pode estar "Pending" (pendente), "Fulfilled" (resolvida) ou Rejected (rejeitada).
	- É comum usar o fetch com o "await" que serve para que voce espere o resultado, o resultado que será do tipo "Response" que é um objeto no formato de stream de texto bruto (com dados como o código da resposta "status", um booleano para indicar se foi bem sucedido "ok", informações do tipo de conteúdo "headers" e o conteúdo da resposta), então voce tem que user o método `.json()` para resolver e converter apenas para o conteúdo json, para isso também é comum usar o "await" para esperar a resolução dos dados para, por exemplo, um array de objetos, que será o retorno do método `.json()`
	- Para usar o "await" voce precisa criar uma função "async" (assíncrona), pois esse tipo de função sempre retorna um Promisse, mesmo que voce não retorne nada, então ela pode usar recursos como "await" para esperar um tempo
	- `async function teste(){ const res = await fetch(); return await res.json(); }`

- #### Sobre funções em JS ou TS
	- Função nomeada (tradicional)
		- `fuction teste(){ //codigo }`
		- Tem nome
		- Pode ser chamada antes da declaração
		- Tem seu próprio "this"
	- Função anônima
		- `const func = function() { //codigo };`
		- Função guardada na variável "func"
		- Não pode ser chamada antes da declaração
		- Tem seu próprio "this"
	- Arrow function
		- `const func = () => { //codigo };`
		- Não tem seu próprio "this"
		- Não pode ser chamada antes da declaração
	- Função anônima autoexecutável
		- `(function(){ //codigo })();`
		- `(async function(){ //codigo })();`
		- Dois exemplos de função, uma delas assíncrona
		- Normalmente usada pra criar ume escopo isolado ou executar um bloco de código assíncrono (tipo "await") dentro de um lugar que não dá

- #### Sobre o useEffect()
	- O useEffect() é um hook do React que permite executar "efeitos colaterais" dentro de componentes, que é qualquer coisa que interaja com algo fora da função como: buscar dados da api, acessar o localStorage, usar setTimeout ou setInterval, adicionar ou remover event listener, alterar o DOM diretamente, etc.
	- Sintaxe: `useEffect(<função>,<lista de dependencias>)`
	- Geralmente voce usa isso colocando uma arrow function no parâmetro da função, e no caso da lista de dependências é o seguinte:
		- `[]` (array vazio) = Executa só uma vez quando o componente monta
		- `[variavel]` =  Executa toda vez que "variavel" mudar
		- Sem array = A cada renderização
	- Exemplo: `useEffect(() => { //conteudo }, []);`
	- Esse é um exemplo que executa apenas uma vez, essa função que voce passar como parâmetro não pode ser async, então voce precisará criar outra função lá dentro caso queria usar alguma funcionalidade async
	- O "return" da função que voce passar como parâmetro será usado de forma diferente, ele será tratado pelo React como uma função de limpeza, por isso, quando voce retorna uma função, essa função será chamada quando voce o componente for desmontado
	- Exemplo: `useEffect(() => { //montado; return () => { //Desmontado } }, []);`
	- Se voce retornar um valor normal sem ser uma função o React apenas vai disparar um warning dizendo que voce fez merda
	- Voce pode ter quantos useEffect() voce quiser: exemplo:
	- `useEffect(() => { console.log("Componente montado") }, []);`
	- `useEffect(() => { console.log("Variavel X mudou") }, [x]);`
	- Essas duas funções pode existir normalmente, se elas tivesse uma função sendo retornada, o React iria chamar todas elas em ordem inversa a da montagem
	- Essa "desmontagem" acontece por exemplo quando voce muda da roda '/home' para '/me', ele iria desmontar o componente `<Home />` e todos os seus componente filhos, chamando a função que está no retorno da função do parâmetro de todos os useEffect(), desmontando primeiro os filhos e depois os pais

- #### React com StrictMode
	- Esse modo faz com que o React monte e desmonte o componente duas vezes seguidas propositalmente, para detectar efeitos colaterais indesejados, por isso quando voce coloca um console.log() no useEffect(), ele será chamado duas vezes

- #### Sobre useState
	- É outro hook de React que serve para que o React atualize certos dados apos recebe-lo, porque quando voce está usando fetch ou qualquer outro tipo de estrutura que passe um "Promise", esse valor nao estará lá instantaneamente, ele chegara depois, e se voce já quiser usar esse valor na renderização, o React não saberá que ele tem que renderizar novamente quando o valor chegar, então voce usa o useState pra isso

- #### Função para ativada com clicks
	- Caso voce tenha algum item que voce quer que reaja a clicks, como um botão (no meu caso serão os cards mesmo), voce pode usar o atributo "onClick" para ativar uma função que fara algo, exemplo:
	- `<div id='botao' onClick={func}>`
	- Nesse exemplo acima voce esta chamando a função "func" caso um evento de click seja registrado na posição da div, caso voce precise de passar parâmetros, voce pode acabar tentando fazer isso (como eu fiz):
	- `<did id='botao' onClick={func("param")}>`
	- Porem se voce fizer isso, o interpretador vai interpretar como uma chamada de função, e não como uma referencia (método sem usar as `()`), então para passar parâmetros voce vai ter que declarar uma arrow function anônima, assim:
	- `<div id='botao' onClick={ () => func("param") }>`
	- Assim vai dar tudo certo

- #### Usando &&
	- O && é o operador lógico que voce pode usar para que uma parte do código so seja executada se outra parte retornar true, como se fosse um if, porem voce pode usar dentro do JSX.Element, outra alternativa seria usar os operadores ternários `?` e `:`
	- sintaxe: `{Valor && <Componente />}`
	- Se o valor existir (não for `null`, `''`,`undefined`, etc) componente será renderizado

- #### Callback via props
	- Se voce usa esse componente filho
	- `function Filho(onClose: { onClose: () => void }) {return <button onClick={onClose}>Fechar</button>;}
	- E chama ele no pai assim:
	- `<Filho onClose={() => setModalAberto(false)} />`
	- Você está permitindo que o filho chame uma função que foi definida no pai. Isso é uma forma de o filho se comunicar com o pai.
	- O pai passa uma função por props (`onClose`), e o filho apenas chama essa função quando quiser acionar algo no pai.
	- Ou seja, o controle continua no pai, mas o filho pode acionar mudanças no estado do pai ao chamar a função que recebeu
	- No exemplo acima, ao clicar no botão, o filho chama `onClose()`, o que faz o pai mudar o estado `modalAberto` para `false`, fechando o modal

- #### Map
	- Serve para transformar os valores de um array, um por um.
	- Você entrega uma função para ele, e ele aplica essa função em cada item do array original.
	- Ele sempre retorna um novo array, com o mesmo tamanho do original.
	- `const numeros = [1, 2, 3];`
	- `{ const dobrados = numeros.map(n => n * 2); // [2, 4, 6]`

- #### Filter
	- Serve para filtrar elementos de um array com base em uma condição.
	- Você entrega uma função que retorna `true` ou `false`, e só os itens que retornarem `true` entram no novo array.
	- Também retorna um novo array, mas com tamanho igual ou menor que o original.
	- `const numeros = [1, 2, 3, 4];`
	- `const pares = numeros.filter(n => n % 2 === 0); // [2, 4]`
	- Também pode colocar mais de uma condição
	- `const pares = numeros.filter(`
	- `    (n => n % 2 === 0 ||`
	- `    n => n % 3 === 1) &&`
	- `    n => n % 4 === 2`
	- `);`

- #### Some
	- Serve para testar se pelo menos um item do array atende a uma condição.
	- Retorna true ou false.
	- Ele para no primeiro elemento que satisfaz a condição, ou seja, é eficiente.
	- `const numeros = [1, 3, 5];`
	- `{const temPar = numeros.some(n => n % 2 === 0); // false`




## 💡 O que eu aprendi

✔ Como estruturar e usar um arquivo `.json` para mock de dados. 
✔ Funcionamento de requisições assíncronas com `fetch()`, `Promise`, e `async/await`. 
✔ As diferenças e usos dos principais tipos de funções em JavaScript/TypeScript. 
✔ Como usar o hook `useEffect` para executar efeitos colaterais, controlando o ciclo de vida do componente. 
✔ O comportamento do `StrictMode` do React e seu impacto durante o desenvolvimento. 
✔ A importância e o uso do hook `useState` para gerenciar o estado e re-renderizar componentes. 
✔ Como lidar com eventos de clique (`onClick`) em JSX, incluindo a passagem de parâmetros. 
✔ Como fazer renderização condicional em React com o operador `&&`. 
✔ Comunicação de um componente filho para um componente pai através de callbacks via `props`. 
✔ Utilização de métodos de array como `.map()`, `.filter()` e `.some()` para manipular e exibir dados.

## 💻 Modificações
- Adicionado arquivo de mock "xp.json"
- Modificado o titulo da pagina
- Modificado cores e design geral dos componentes atuais
- Removido o README que o vite adiciona por padrão
- Corrigido datas do cronograma (o nome dos dias da semana estavam errados)
- Adicionado componentes Card, CardModal e SearchBox
- Adicionado pesquisa de card por texto ou tags