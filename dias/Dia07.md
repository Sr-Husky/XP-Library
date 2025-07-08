# Dia 07 - Revisão e Ajustes

**Data:** 07/07/2025
## ✏ O que eu estudei/fiz hoje

- Hoje eu vou deixar tudo pronto, vou tentar aperfeiçoar a responsividade e vou comentar o código certinho (deveria ter feito isso desde o começo)
- Já arrumei tudo que achei necessário, então fui pesquisar se tem algo de errado, eu vi que tem muitas coisas que são apenas questão de boas praticas, que eu deveria ter feito, claro que para um começo isso não é tão importante, mas também é verdade que oque separa um profissional de um amador é que o profissional pode não saber de tudo, mas oque ele sabe ele faz bem, e é isso que eu devo buscar a partir de agora, por mais que eu ainda tenha muita coisa pra aprender
- Uma dessas boas práticas é usar o "axios" que faz a mesma função que o "fetch", porem ele é mais completo:
	- Faz a conversão automática do "json"
	- Considera erros de server como "404 Not Found" ou "500 Internal Server Error" (o fetch so considera erro os problemas de rede)
	- Pode definir uma configuração padrão de URL pra buscar
	- Permite interceptar requisições e ou respostas antes de serem processadas
- Outra coisa muito importante é usar uma biblioteca de server state, como o React Query pois ele tem:
	- Cache inteligente que salva os dados da primeira requisição em cache, e numa próxima requisição ele irá fornecer os dados do cache automaticamente e buscar no banco de dados se houver alguma atualização nos dados, ser hover, ele ira atualizar assim que os dados chegarem
	- Gerencia loading e error
	- Qualquer componente pode usar os dados
- Para questões de organização, é considerado boas praticas eu criar um arquivo só para os tipos de dados, como os dados do usuário e do card no meu caso, eu faria isso para poder restringir os dados a certo tipo e para evitar de cometer alguns erros ao programar, enfim, apenas para fins de organização, praticidade e segurança. Oque ta se mostrando muito importante programando nesse tipo de coisa, pois ta tudo meio bagunçado e leva um tempinho para ler e enteder certas partes do código
- Criar um arquivo .env para colocar a URL da API também é algo importante, pois eu provavelmente vou chamar essa API muitas vezes e eu teria que colocar a URL em cada chamada, oque não é um problema em si, o problema é que ao desenvolver um site o objetivo óbvio vai ser rodar o site em ambiente de produção, mesmo não sendo o meu caso, eu devo já fazer pensando nisso que serão as situações reais, e eu não quero ter que trocar a URL de todas as requisições que estão sendo feitas pra API localmente
- O arquivo .env é um arquivo de variáveis de ambiente, igual tem no windows, são meio que variáveis globais que eu posso usar em qualquer lugar
- Vou colocar aqui o procedimento que estou fazendo para implementar o axios:
	- Instalar o modulo `npm install axios`
	- Criar o diretório `src/services`, que é onde eu vou colocar os arquivos .ts que vão meio que configurar o ambiente padrão pra fazer requisições. E sim o formato vai ser .ts ao invés de .tsx porque os arquivo .tsx server especificamente para quando eu quero exportar algum JSX.Element
	- Criar o arquivo `api.ts`, aqui é onde eu vou colocar o "axios" que vai estar recebendo a variavel de ambiente do `.env` (que eu ainda vou fazer) para definir uma URL padrão. No arquivo eu importo o axios, uso a função `criate()` para colocar na constante "api" a instancia do axios que já vai estar com a URL definida, e agora eu so preciso usar esse "api" nos meus componentes
	- Criar os tipos de objetos, para isso eu criei a pasta "types" em "src" e adicionei os arquivos `xp.ts` e `user.ts`  com um `export interface` que serve para exportar tipos, que depois serão recebido pelo `import type`, assim como eu usei pra importar o tipo do "xp" no "user" (obs: o campo "senha" do usuário vai ser removido posteriormente, mas por enquanto eu preciso de ter ele alí)
	- Tem uma coisa que se chama "payload" que é meio que o pacote de informações que eu envio para uma requisição, como um cadastro por exemplo que pode precisar de "nome", "email" e "senha", eu poderia definir qual é o tipo desse payload igual eu fiz com "xp" e "user", no caso dos payloads do user, eu ja definiria os tipos la mesmo: `export interface createUserPayload{ ... }`, e agora no services eu iria criar uma função que usa a "api" do arquivo `api.ts` para fazer a requisição de post por exemplo que recebe o payload como argumento e faz a requisição enviando o payload, e então eu so teria que chamar essa função em algum componente e passar os dados no formato que eu defini do payload, mas eu não vou fazer tudo isso agora porque eu quero fazer junto com o back-end, seguindo um fluxo bem definido na minha cabeça.
	- Criar o arquivo `userServices.ts` em "/services" que é onde eu vou definir as funções que mencionei anteriormente, é so pra eu não precisar de fazer as requisições manualmente em todos as vezes que eu precisar, então eu so crio uma função que faz ela pra mim e passou os parâmetros, no meu caso eu fiz somente a do getUsers() para pegar a informação de todos usuários, e fazer o mesmo para o "xp"
	- Outra coisa que vou ter que fazer é parar de usar o localStorage para pegar dados do usuário, mas isso eu vou corrigir assim que eu arrumar o React Query, vou fazer isso junto com o back também para seguir uma linha de raciocíonio linear
	- Mudei todos os arquivos para usar o meu serviço da api
	- Relembrando, ainda preciso tirar a senha dos tipo "User", tenho que usar Query e tenho que definir o payloads, até o momento esses são meus planos
## 💡 O que eu aprendi

✔ As vantagens de usar a biblioteca `axios` em vez do `fetch` nativo para requisições HTTP, como a conversão automática de JSON e um tratamento de erros mais robusto. 
✔ A importância de bibliotecas de gerenciamento de estado do servidor, como o React Query, para otimizar requisições com cache inteligente e gerenciar estados de carregamento (`loading`) e erro de forma automática. 
✔ Boas práticas para a organização de projetos, como a criação de um diretório de `services` para centralizar e abstrair a lógica de comunicação com a API. 
✔ Como criar uma instância base do `axios` com configurações padrão (por exemplo, a `baseURL`) para ser reutilizada em todo o projeto, evitando a repetição de código. 
✔ A importância de definir tipos (`interface`) para as estruturas de dados da aplicação (como `User` e `Xp`) e para os "payloads" de requisições, o que aumenta a segurança e a manutenibilidade do código. 
✔ A utilização de arquivos `.env` para gerenciar variáveis de ambiente, como a URL da API, permitindo separar as configurações do código-fonte e facilitar a mudança entre ambientes de desenvolvimento e produção. 
✔ A distinção entre as extensões de arquivo `.ts` (para lógica pura de TypeScript) e `.tsx` (para arquivos que contêm código JSX).
## 💻 Modificações

- Botões pequenos no "NavBar" em caso de telas portrait
- Modificado botões da tela de confirmação
- Modificado responsividade de todas paginas do site
- Agora eu tenho uma estrutura de serviços para requisições da API
