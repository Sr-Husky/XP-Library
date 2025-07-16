# Dia 16 –  **Integração da Autenticação no Frontend**

**Data:** 16/07/2025

## ✏ O que eu estudei/fiz hoje

- Vendo os objetivos de hoje percebi que parte dele já foi implementada ontem, oque eu tenho para fazer hoje é simplesmente implementar um contexto ou hook para salvar os dados de usuário e o token num escopo global que eu possa visualizar de qualquer lugar do codigo
- Para criar esse contexto primeiro criei o arquivo `src\contexts\AuthContext.tsx`, nesse arquivo eu vou retornar um componente que irá conter a lógica toda do contexto, afinal o contexto será um conjunto de informações que eu vou poder acessar de qualquer lugar do codigo, então esse  componente vai ter esses valores (definidos num objeto) e todos os seus 'filhos' poderão acessa-los, esse componente com a lógica é chamado de provedor.
- Primeiro eu vou definir quais são os dados que vou usar nos outros componentes:
	- user: User | null;
	- token: string | null;
	- isAuthenticated: boolean;
	- contextLogin: (userData: User, token: string) => void;
	- contextLogout: () => void;
- Isso tudo formara um objeto que vai ser o "value" no componente.
- Agora vou fazer a função `AuthProvider` que é onde vou colocar toda a logica, definindo um estado para o token e para o user, e criando as funções de login e logout para colocar/remover os dados do localstorage
- Para criar o contexto de fato vou usar o `createContext()` do react, nos especificamos o tipo dele, que será o seu retorno, que é claro vai ser o objeto com os dados que eu quero, vai ficar assim: `const AuthContext = createContext<AuthContextType | undefined>(undefined);` ele começa com undefined
- Agora para usar o contexto vou criar uma função `useAuth()`, essa função cria uma variável com o valor retornado de `useContext(AuthContext)`, essa função do react vai retornar o contexto para a variável para que possa ser usada como hook para o contexto, agora eu posso só chamar a função `useAuth` em qualquer lugar que ela vai me retornar um hook para meu contexto, esse hook me permite chamar qualquer função ou ler qualquer variável do contexto
- Eu usei esse hook em todos os lugares que eu chamava a API para pegar o objeto do "user", pois no próprio login eu já pegava o user, só não usava ele completo, mas agora eu retorno ele junto com a resposta da requisição, então eu posso só guardar ele assim como eu guardo o token, o problema é que para pegar os favoritos, eu pego direto do "user" e não acho apropriado criar uma requisição so pra pegar os favoritos de um usuário, pois isso faz parte dos dados de usuário, e então sempre que eu chamo a função de login e ela pega os dados do usuário uma vez, ela não atualiza fazendo uma nova chamada caso eu adicione um favorito, fazendo com que sejá necessario logar e deslogar para então carregar os dados do usuário com os favoritos atualizados, porem não vou resolver esse problema agora pois isso provavelmente vai ser resolvido com React Query que vou implementar depois.
- Além disso tinha também o problema de, ao dar like, a data de modificação da experiência mudava, pois estava configurada para atualizar a data a cada modificação no schema, então eu troquei para mudar a data apenas modificando manualmente, que já era feito quando os dados dá experiência são atualizados. 

## 💡 O que eu aprendi

✔ Como criar e estruturar um contexto global em React usando `createContext()` para compartilhar estado e funções (como dados de usuário, token e funções de login/logout). 
✔ O conceito de um componente "Provider" (ex: `AuthProvider`), que encapsula a lógica do contexto e disponibiliza seus valores para toda a árvore de componentes filhos. 
✔ Como criar um hook customizado (ex: `useAuth`) para simplificar e centralizar o acesso ao contexto, encapsulando a chamada ao hook `useContext()`. 
✔ A aplicação prática do Context API para gerenciar o estado de autenticação do usuário em toda a aplicação, evitando código redundante e chamadas de API desnecessárias. 

## 💻 Modificações

- Criado arquivo `src\contexts\AuthContext.tsx`
- Criado lógica de contexto e hook para evitar código redundante
- Modificado `schema.prisma` para não atualizar 'mod' com interações
- Modificado varias partes do front para se adaptar ao `AuthContext`