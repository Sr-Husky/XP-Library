# Dia 18 –  **Introdução ao React Query e Refatoração da Home**

**Data:** 18/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje eu vou finalmente usar o ReactQuery, e na teoria minha aplicação deve ficar bem fluida agora, atualizando todos os dados imediatamente
- Vou começar instalando as bibliotecas:
	- `npm install @tanstack/react-query`: para usar o ReactQuery
	- `npm install @tanstack/react-query-devtools`: para depuração
- No meu `main.tsx` eu coloquei o ReactQuery envolvendo toda minha aplicação, como um contexto global, eu criei um queryClient e associei ele ao provedor do ReactQuery
- E também coloque o devtools no mesmo nível que a minha aplicação, ele aparece la em baixo kkkk que negocio doido, é muito eficiente
- Eu fiz várias alterações em todos os componentes que ví, eu nem fui documentando enquanto eu fazia porque simplesmente estava dando tudo errado. O fato de eu ter começado a fazer tudo sem experiência nenhuma, me fez fazer tudo de uma forma em que eu teria que modificar um pedaço enorme do código para adaptar para uma mudança pequena, cada dia que passa fica mais obvio uma coisa que eu percebi semana passada: "Organização é tudo", se eu tivesse feito tudo de forma mais organizada, mais separada, mais limpa, mais identificável, mais adaptável, tudo seria tão mais fácil, é isso que dá a falta de experiencia, eu acabei tendo que fazer muitas gambiarras, e eu nem consegui entender direito como o ReactQuery realmente funciona pois ele estava se comportando de umas formas muito estranhas e sem um padrão, provavelmente por causa de alguma bagunça que eu fiz, mas enfim, no fim de tudo eu consegui adaptar o código para funcionar, provavelmente está longe de perfeito e cheio de más práticas, isso é algo que eu com certeza vou aperfeiçoar e não vou mais entrar nessa situação, se eu fosse fazer tudo do zero eu faria tudo diferente, provavelmente não faria de forma incremental, pois de acordo com minha experiência nesse projeto, eu acho que tudo teria sido melhor se eu tivesse feito já pensando em nunca mais mudar (claro que no meu caso isso seria inviável pois eu teria que aprender tudo antes de começar, e não é assim que a banda toca), porem uma coisa que também faltou foi planejamento, não que eu tenha deixado isso de lado de propósito, eu simplesmente não sabia como planejar pois eu não sabia o conteúdo, mas agora que eu sei, eu com certeza teria planejado melhor, nem se fosse apenas um planejamento mental, mas um planejamento bem estruturado e registrado iria ser de grande ajuda, como se eu fosse escrever os requisitos da minha aplicação, mas acho que esse papel precisa de ser feito por alguem que tenha muita experiência e que saiba exatamente como que tudo vai se organizar no código, claro que não tem que ser específico em níveis desnecessário, mas a organização do fluxo dos dados tem que ser bem detalhada para não ter perrengue nenhum na hora de adicionar alguma funcionalidade.
- Bom, resumindo oque eu fiz, eu usei as funções (useMutation e useQuery) em todos os lugares que precisava, eu coloquei a parte do query do usuário no contexto, para que eu não precise de usar um query em todas as páginas, e no caso do query para os "xp's" eu fiz individualmente em cada lugar que era necessário.

## 💡 O que eu aprendi

✔ Como instalar e configurar o React Query em um projeto, envolvendo a aplicação com o `QueryClientProvider` no arquivo principal (`main.tsx`). 
✔ Como integrar e utilizar as DevTools do React Query (`@tanstack/react-query-devtools`) para depurar e visualizar o estado do cache. 
✔ A aplicação dos hooks `useQuery` e `useMutation` para substituir a lógica de `fetch` manual e gerenciar o estado de dados que vêm do servidor. 
✔ Uma estratégia para gerenciar dados globais (como os do usuário) combinando `useQuery` com o React Context. 
✔ Uma lição prática sobre a importância da organização, do planejamento e de uma arquitetura limpa no desenvolvimento de software, ao enfrentar as dificuldades de refatorar um código com alto acoplamento e "gambiarras". 
✔ A percepção do que é "dívida técnica" na prática e como decisões de arquitetura iniciais, feitas com pouca experiência, impactam drasticamente a facilidade de adicionar novas funcionalidades ou fazer mudanças no futuro.

## 💻 Modificações

- Instalados módulos do ReactQuery
- Configurado `useQuery()` para todas as chamadas da API que foram necessárias
- Aplicada lógica de invalidação de cache para forçar um novo `fetch` e atualizar componentes