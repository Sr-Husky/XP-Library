# Dia 05 – **Me + Favoritas**

**Data:** 05/07/2025

## ✏ O que eu estudei hoje

- #### useNavigate()
	- Eu finalmente cheguei no ponto em que eu preciso trocar de paginas durante a interação do usuário, para isso eu usei o useNavigate() que é um hook do módulo "react-router-dom"
	- Hooks do react-router-dom como useLocation, useNavigate ou useParams só funcionam se o componente que os utiliza estiver dentro de um componente `<BrowserRouter>` (ou outro tipo de roteador, como `<HashRouter>`)
	- Para usa-lo voce só precisa importar:
	- `import { useNavigate } from 'react-router-dom'`
	- Depois criar uma variável no escopo da função principal que receberá a função de navegação
	- `const navigate = useNavigate();`
	- Agora é so navegar para a rota que voce quiser
	- `navigate('/rota')`

- #### useLocation()
	- Um hook também do `react-router-dom` para coletar informações da url, funciona quase igual o useNavigation, primeiro voce importa:
		- `import { useLocation } from "react-router-dom";`
	- Depois cria a variável no escopo da função principal:
		- `const location = useLocation();`
	- Depois é só pegar a informação que voce quiser meu nobre, a página atual por exemplo vai estar em:
		- `location.pathname`
	- Aqui está todas as informações que dá pra conseguir:
		- `pathname: "/me"`        // o caminho atual da URL
		- `search: "?q=abc"`      // query string
		- `hash: "#ancora"`        // hash na URL
		- `state: ...`                 // estado opcional passado via navigate()
		- `key: "abc123"`           // identificador interno da navegação

- #### localStorage()
	- Eu já tinha usado antes mas tinha esquecido, é bem simples, para guardar um valor:
	- `localStorage.setItem(<chave>, <valor>);`
	- Exemplo:
		- `localStorage.setItem("usuario", JSON.stringify(user));`
	- Usamos o `stringify` pois o valor deve ser string
	- Para pegar um valor do local storage é so usar o `getItem()` e passar a "chave", exemplo:
		- `const userString = localStorage.getItem("usuario");`
	- Para remover use o `removeItem()`, exemplo:
		- `localStorage.removeItem("usuario");`

- #### Heroicons
	- Pelos mesmo criadores do Tailwind, o heroicons é uma biblioteca de ícones que dá pra importar no seu projeto e usar ícones de vários tipos, voce instala via npm:
		- `npm install @heroicons/react`
	- E então importa no seu componente:
		- `import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"`
	- Assim voce pode usar os ícones como componentes separados:
		- `<PencilIcon className="w-5 h-5" />`

- #### textArea
	- O textArea é uma tag que voce pode usar quando precisar de um input multilinhas, ele por padrão tem um tamanho fixo, se voce ultrapassa esse tamanho, ele cria uma scroll bar, mas dá pra contornar isso com um esqueminha que o gepeto me mostrou:
		- `onInput={(e) => {e.currentTarget.style.height = "auto"; e.currentTarget.style.height = ${e.currentTarget.scrollHeight}px}}`
	- Essa é uma propriedade que ativa quando recebe um `InputEvent`, a variável `e` vai receber um evento de input, mais especificamente um `React.FormEvent<HTMLTextAreaElement>` e ele contem:
		- `e.currentTarget`: referência segura ao `<textarea>` que disparou o evento
		- `e.target`: o elemento que disparou o evento
		- `e.nativeEvent`: o evento nativo do DOM (`InputEvent`)
		- `e.preventDefault()`: pra prevenir comportamento padrão
		- `e.stopPropagation()`: pra evitar propagação do evento
	- Diferença entre `e.currentTarget` e `e.target`
		- `e.currentTarget`: sempre o elemento onde o handler foi registrado (`<textarea>` neste caso)
		- `e.target`: o elemento que realmente disparou o evento (pode ser um filho, em casos como `onClick` em uma `div` com botões dentro)
		- No caso de `onInput` em `<textarea>`, eles são iguais
	- Então agora finalmente falando sobre o esqueminha pra fazer ele aumentar conforme o tanto de caracteres: voce usa o `currentTarget.style.height = "auto"` para que o voce "resete" o height do textArea, caso o contrario quando voce usasse o próximo parâmetro (para pegar a altura do height) ele retornaria o valor errado, e usa o: `currentTarget.style.height = ${e.currentTarget.scrollHeight}px}` para que ele defina o tamanho da caixa no tamanho do "scrollHeight" que é o tamanho da tela total que o scroll está gerenciando. 
	- Para isso voce também vai precisar de alguns estilos para ajudar como o `overflow-hidden` para esconder o controle de scroll e o `resize-none` para impedir que o usuário redimensione manualmente.

- #### .document
	- O `.document` vem da Web API nativa do navegador e representa o DOM completo carregado na pagina atual, inclusive os elementos que forma renderizados pelo React, voce pode usar ele a qualquer momento para modificar qualquer elemento da pagina, exemplo:
		- `document.body; // toda a <body>`
	- Para selecionar um elemento especifico voce precisa de alguma forma de identificar ele, pra isso voce usa o "id", "class" ou "name" para que então voce possa seleciona-los usando o querySelector, que ira retornar um HTMLElement, por exemplo:
		- `const el = document.querySelector('#meu-id');`
	- Com isso voce pode modificar atributos:
		- `el.id = "novo-id";`
		- `el.className = "nova-classe";`
		- `el.setAttribute("data-x", "123");`
	- Pode modificar Estilo:
		- `el.style.color = "red";`
		- `el.style.height = "100px";`
		- `el.style.display = "none";`
	- Adicionar/remover classes
		- `el.classList.add("ativo");`
		- `el.classList.remove("inativo");`
		- `el.classList.toggle("ativo");`
	- Manipular eventos:
		- `el.addEventListener("click", () => alert("clicou"));`
	- Ou remover o elemento:
		- `el.remove();`
	- O `document` tem varias funções muito úteis como:
		- `getElementById()`
		- `querySelector()`
		- `querySelectorAll()`
		- `createElement()`
		- `addEventListener()` (em elementos)
	- E também propriedades globais como:
		- `document.title`
		- `document.body`
		- `document.documentElement` (a tag `<html>`)

- #### useRef()
	- Serve para pegar uma referencia do elemento HTML, assim como voce conseguiria pelo `document`, voce simplesmente importa e cria um `useRef()`:
		- `import { useRef } from 'react'`
		- `const referencia = useRef(null);`
	- Agora voce usa a propriedade `ref` de algum elemento para o HTMLElemente dele para a sua variável do useRef, assim:
		- `<textarea ref={referencia} />`
	- Agora voce pode modifica-lo diretamente assim:
		- `ref.current.style.height = "auto";`
		- `ref.current.style.height = ${ref.current.scrollHeight}px;`
	- Esse exemplo que usei foi o usado no projeto pra definir a largura inicial do `textarea`

- #### Atualizar um estado
	- Como eu já to careca de saber, pra atualizar um estado eu uso a função que vem junto com ele, mas caso eu queira acessar o valor anterior, ou acrescentar algo (caso seja um array), voce pode fazer assim:
		- `setArray(atual => [...atual, novoItem]);`
	- Explicação:
		- `setArray(...)`: chama a função que atualiza o estado (`useState`).
		- `atual => ...`: é uma função de atualização. O React passa o valor atual do estado como `atual`.
		- `[...atual, novoItem]`: cria um novo array, copiando todos os itens anteriores (`atual`) e adicionando `novoItem` no final.
		    - `...atual` → espalha os itens anteriores
		    - `novoItem` → é adicionado ao final

- #### Estilos
	- Aqui vai agora uma lista dos estilos (nem todos que eu usei) mais importantes do tailwind, vou usar esse arquivo como materia de consulta assim como os outros, aqui vai:
	- **Layout**:
		- `block`: Transforma um elemento em um elemento de bloco (ocupa toda a largura).
		- `inline-block`: Cria um elemento de bloco, mas que flui com o texto.
		- `inline`: Transforma um elemento em um elemento em linha (ocupa apenas o espaço necessário).
		- `hidden`: Esconde o elemento (`display: none`).
		- `flex`:Aplica `display: flex`, tornando o elemento um contêiner flexbox.
		- `inline-flex`: Aplica `display: inline-flex`.
		- `grid`: Aplica `display: grid`, tornando o elemento um contêiner de grid.
		- `inline-grid`: Aplica `display: inline-grid`.
		- `container`:Centraliza o conteúdo e adiciona preenchimento lateral responsivo.
		- `relative`: Define a posição de um elemento como relativa.
		- `absolute`: Define a posição de um elemento como absoluta em relação ao seu ancestral posicionado mais próximo.
		- `fixed`: Define a posição de um elemento como fixa em relação à viewport.
		- `sticky`: Define a posição de um elemento como "sticky", que alterna entre `relative` e `fixed`
		- `top-0`, `bottom-0`, `left-0`, `right-0`: Posiciona um elemento em relação às bordas do seu contêiner (`top`, `bottom`, `left`, `right`).
	- Espaçamento
		- `m-{size}`: Adiciona margem em todos os lados (ex: m-4).
		- `mx-{size}`: Adiciona margem nos eixos x (esquerda e direita) (ex: mx-auto para centralizar).
		- `my-{size}`: Adiciona margem nos eixos y (topo e base) (ex: my-8).
		- `mt-{size}, mb-{size}, ml-{size}, mr-{size}`: Adiciona margem em uma direção específica (topo, base, esquerda, direita).
		- `p-{size}`: Adiciona preenchimento (padding) em todos os lados (ex: p-4).
		- `px-{size}`: Adiciona preenchimento nos eixos x (esquerda e direita) (ex: px-6).
		- `py-{size}`: Adiciona preenchimento nos eixos y (topo e base) (ex: py-2).
		- `pt-{size}, pb-{size}, pl-{size}, pr-{size}`: Adiciona preenchimento em uma direção específica.
		- `space-x-{amount}`: Adiciona espaço horizontal entre elementos filhos.
		- `space-y-{amount}`: Adiciona espaço vertical entre elementos filhos.
	- Dimensionamento:
		- `w-full`: Define a largura como 100%.
		- `w-screen`: Define a largura como 100% da largura da tela (viewport).
		- `w-auto`: Define a largura como automática.
		- `w-{fraction}`: Define a largura como uma fração (ex: `w-1/2` para 50%).
		- `w-{size}`: Define uma largura fixa a partir da escala de espaçamento (ex: `w-64`).
		- `max-w-full`: Define a largura máxima como 100%.
		- `max-w-screen-{breakpoint}`: Define a largura máxima com base nos breakpoints da tela.
		- `max-w-{size}`: Define uma largura máxima específica (ex: `max-w-md`).
		- `h-full`: Define a altura como 100%.
		- `h-screen`: Define a altura como 100% da altura da tela (viewport).
		- `h-auto`: Define a altura como automática.
		- `h-{size}`: Define uma altura fixa a partir da escala de espaçamento (ex: `h-32`).
		- `min-h-screen`: Define a altura mínima como 100% da altura da tela.
	- Tipografia
		- `text-{size}`: Define o tamanho da fonte (ex: `text-lg`, `text-2xl`).
		- `font-{weight}`: Define a espessura da fonte (ex: `font-bold`, `font-semibold`).
		- `text-{color}`: Define a cor do texto (ex: `text-gray-800`, `text-blue-500`).
		- `text-left`, `text-center`, `text-right`: Alinha o texto.
		- `italic`, `not-italic`: Aplica ou remove o estilo itálico.
		- `underline`, `no-underline`: Adiciona ou remove o sublinhado.
		- `leading-{size}`: Define o espaçamento entre linhas (line-height) (ex: `leading-relaxed`).
		- `tracking-{size}`: Define o espaçamento entre letras (letter-spacing) (ex: `tracking-wider`).
		- `uppercase`, `lowercase`, `capitalize`: Transforma o texto para maiúsculas, minúsculas ou capitaliza a primeira letra.
	- Cores de fundo
		- `bg-{color}`: Define a cor de fundo (ex: `bg-white`, `bg-indigo-600`).
		- `bg-transparent`: Define o fundo como transparente.
		- `bg-opacity-{value}`: Define a opacidade da cor de fundo (ex: `bg-opacity-50`).
	- Bordas
		- `border`: Adiciona uma borda sólida de 1px em todos os lados.
		- `border-{width}`: Define a largura da borda (ex: `border-2`, `border-4`).
		- `border-{color}`: Define a cor da borda (ex: `border-gray-300`).
		- `border-{side}`: Adiciona uma borda em um lado específico (ex: `border-t-2`).
		- `rounded`Adiciona um leve arredondamento nos cantos.
		- `rounded-{size}`: Adiciona um arredondamento específico nos cantos (ex: `rounded-lg`, `rounded-full` para círculo).
		- `rounded-{corner}-{size}`: Arredonda cantos específicos (ex: `rounded-t-lg`).
		- `divide-x`, `divide-y`: Adiciona bordas entre elementos filhos.
		- `divide-{color}`: Define a cor das bordas criadas com `divide`.
	- Flexbox
		- `flex-row`, `flex-row-reverse`: Alinha os itens na horizontal (padrão) ou na ordem inversa.
		- `flex-col`, `flex-col-reverse`: Alinha os itens na vertical ou na ordem inversa.
		- `items-start`, `items-center`, `items-end`, `items-stretch`: Alinha os itens no eixo transversal (vertical se `flex-row`, horizontal se `flex-col`).
		- `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`: Alinha os itens no eixo principal (horizontal se `flex-row`, vertical se `flex-col`).
		- `flex-wrap`, `flex-nowrap`, `flex-wrap-reverse`: Controla se os itens quebram para a próxima linha.
		- `flex-1`: Permite que um item flexível cresça para preencher o espaço disponível.
		- `flex-grow`, `flex-shrink`: Controla a capacidade de um item crescer ou encolher.
		- `gap-{size}`: Adiciona um espaçamento entre todos os itens de um contêiner flex ou grid.
		- `gap-x-{size}`, `gap-y-{size}`: Adiciona espaçamento no eixo x ou y.
	- Grid
		- `grid-cols-{number}`: Define o número de colunas do grid (ex: `grid-cols-3`).
		- `grid-rows-{number}`: Define o número de linhas do grid.
		- `col-span-{number}`: Faz um item ocupar um número específico de colunas.
		- `row-span-{number}`: Faz um item ocupar um número específico de linhas.
		- `col-start-{line}`, `col-end-{line}`: Define a linha de início ou fim de um item na coluna.
	- Responsividade e Estados
		- `sm:`, `md:`, `lg:`, `xl:`, `2xl:`Aplica um estilo a partir de um determinado breakpoint (tamanho de tela). Ex: `md:text-lg`.
		- `hover:`Aplica um estilo quando o mouse está sobre o elemento. Ex: `hover:bg-blue-700`.
		- `focus:`Aplica um estilo quando o elemento está em foco (ex: um input). Ex: `focus:ring-2`.
		- `active:`Aplica um estilo quando o elemento está sendo ativado (clicado). Ex: `active:scale-95`.
		- `disabled:`Aplica um estilo quando o elemento está desabilitado. Ex: `disabled:opacity-50`.
		- `dark:`Aplica um estilo quando o modo escuro está ativado no sistema do usuário. Ex: `dark:bg-gray-800`.
	- Efeitos e Filtros
		- `shadow`Adiciona uma sombra sutil.
		- `shadow-{size}`: Adiciona sombras de diferentes tamanhos e intensidades (ex: `shadow-md`, `shadow-lg`, `shadow-xl`).
		- `opacity-{value}`: Define a opacidade de um elemento (ex: `opacity-75`).
		- `transition`: Adiciona uma transição suave para mudanças de propriedade.
		- `duration-{time}`: Define a duração da transição.
		- `ease-{timing}`: Define a curva de aceleração da transição (ex: `ease-in-out`).
		- `transform`: Habilita transformações CSS.
		- `scale-{value}`: Escala um elemento (ex: `scale-105`).
		- `rotate-{degrees}`: Rotaciona um elemento (ex: `rotate-90`).
		- `translate-x-{amount}`, `translate-y-{amount}`: Move um elemento nos eixos x ou y.
		- `cursor-pointer`: Muda o cursor para uma "mãozinha" para indicar que o elemento é clicável.
		- `z-{index}`: Controla a ordem de empilhamento dos elementos (`z-index`).

## 💡 O que eu aprendi

✔ Como navegar entre páginas de forma programática utilizando o hook `useNavigate` do `react-router-dom`. 
✔ Como obter informações sobre a URL atual, como o `pathname`, através do hook `useLocation`. 
✔ Como armazenar (`setItem`), ler (`getItem`) e remover (`removeItem`) dados persistentes no navegador com a `localStorage` API. 
✔ Como instalar e integrar bibliotecas de ícones, como `Heroicons`, para usar em componentes React. 
✔ Técnicas para manipulação do DOM, como fazer um `textarea` se expandir automaticamente com o conteúdo e o uso do `document.querySelector` para selecionar elementos. 
✔ A utilização do hook `useRef` para obter uma referência direta a elementos HTML dentro de um componente React. 
✔ O padrão correto para atualizar um estado que depende de seu valor anterior, como adicionar um item a um array, usando uma função de callback (`setArray(atual => [...atual, novoItem])`). 
✔ Aplicação de diversas classes de utilidade do Tailwind CSS para estilizar componentes, abrangendo layout, espaçamento, tipografia, cores, bordas, flexbox e responsividade.
## 💻 Modificações

- Corrigido bug na pagina '/entrar'
- Página '/me' implementada
- Redirecionamentos entre páginas '/me' e '/entrar' implementado
- Instalado `@heroicons/react` para usar ícones de deletar e editar
- Adicionado componente "confirmar"
- Pagina '/favoritas' revogada, agora tudo é exibido em '/me'
- Cards favoritos serão guardados nos dados do usuário para que eles não possam ser apagados ou modificados pelo autor
- Barra de navegação agora passa parâmetros para a página atual