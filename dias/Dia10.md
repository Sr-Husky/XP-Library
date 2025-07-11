# Dia 10 – **CRUD Básico de experiências**

**Data:** 10/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje foi o dia que eu crie as rotas e testei a conexão como frontend, acredito que já consegui trocar tudo que precisava ser trocado para pegar os dados da API e não dos dados mockados
- Percebi vários problemas de segurança que me deixaram agoniado, mas como eu não estou usando nenhum método de criptografia ou tokens (JWT), eu não posso fazer muita coisas para mudar isso, eu não sei se isso iria aumentar muito a complexidade do projeto, mas eu preferi não usar, mas com certeza é algo que, com o conhecimento que tenho agora, faria com toda certeza.
- Eu fiz várias rotas e usei modos diferente para coletar os dados da API, que foram por "@Query", "@Param" e "@Body". O @Query é aquele em que eu passo parâmetros grandes, mas que ainda sim podem estar na URL, como no meu caso que eu usei para pegar no banco de dados só as experiências que corresponde a busca ou as tags que eu quiser, (inclusive eu ainda mantive a função de filtro do Home.tsx, mas vou remover para usar unicamente as consultas de banco de dados), já o "@Param" é bom para usar quando eu preciso de passar algum parâmetro mais especifico na URL, eu usei ele em todas as vezes que eu precisei fazer uma busca por "id", tanto no "xp" quanto no "user". Já o "@Body" eu uso quando eu preciso transmitir dados complexos, como objetos, eu usei ele para criar novas experiências no banco de dados ou para atualizar alguma já existente (já deixei o terreno pronto para quando eu for querer alterar apenas a visibilidade (que não deve zerar os likes já que não é uma modificação do conteúdo da experiência) que é algo que vou implementar depois).
- A ordem das rotas no controller importam, eu tinha colocado o getXp() em primeiro, ele mapeia a rota "/xp/:id", e acontece que quando eu estava querendo buscar uma rota com dois caminhos diferentes como "xp/publicas", o nest buscava a rota por ordem de declaração, e na primeira que é o "/xp/:id" ele já entrava por interpretar o "publicas" como um "id", ou seja, o melhor que eu posso fazer é colocar as rotas com os caminhos mais específicos primeiro, e em baixo os que estão em um caminho mais "alto" pegando como analogia uma arvore onde a raiz fica no "alto".
- Também tive que criar um DTO para tipar o parâmetro que era enviado para o "create" do prisma, nesse DTO, eu não especifiquei o "id" pois ele é gerado automaticamente, mas mesmo omitindo ele, quando eu passava o objeto inteiro (que continha um id) para uma variavel com o tipada com esse DTO ele considerava esse campo "id" mesmo assim, então eu vi que para corrigir isso eu poderia usar pipes, que validam tudo antes de enviar para o banco de dados, pipes esse que eu inclusive usaria nos proprios DTO's para não permitir tipos diferentes, mas isso adicionaria mais uma complexidade que, para o meu caso em especifico, eu não achei necessário, pois eu só precisaria dele para tratar um caso especifico, mas num projeto real ele quebraria o galho demais.
- O @Param so retorna valores em "string", então eu tenho que converte-los caso queira usar em outro tipo
- O tipo Date também consegue receber um valor do tipo string, então voce pode colocar uma data no modo string nele, e só converter depois para o objeto Date de fato, para pegar a hora atual em string voce pode usar `new Date().toISOString()`
- Também aprendi sobre como funciona o try-catch no JS, é basicamente o padrão, tudo que está dentro do try pode lançar uma exceção, se nenhum exceção for lança, o bloco do catch será ignorado, se alguma exceção for lançada, a execução é interrompida imediatamente e o bloco catch é carregado, no bloco catch voce especifica uma variável que vai guardar o que voce mandar no "throw", esse valor será usado para identificar o erro. Eu usei o `NotFoundException` e `UnauthorizedException`, esse são os erros 404 e 401 respectivamente, que são os erros que eu trato na minha tela de login.
- Sobre as consultas no banco de dados que são repetidas em vários componentes, eu fiz assim pois pretendo implementar o React Query, que com o sistema de cache vai transformar tudo isso em uma vantagem, pois em todos os componentes eu vou ter os dados atualizados, e caso não estejam ele já vai fazer a busca onde quer que eu esteja.
- Também é por isso que eu criei mais de um serviço que retorna os mesmos dados, como o "getUser()" e o "login()", ambos retornam o usuário, mas um deles busca pelo id e apenas retorna o usuário, e o outro valida os dados de login, essa ambiguidade não me prejudica pois deixa tudo mais modular.

## 💡 O que eu aprendi

✔ As diferenças e os casos de uso práticos dos decorators do NestJS: `@Query` para filtros na URL, `@Param` para identificadores na rota e `@Body` para objetos complexos no corpo da requisição. 
✔ A importância da ordem de declaração das rotas em um controller: rotas mais específicas (ex: `/xp/publicas`) devem ser definidas antes de rotas genéricas com parâmetros (ex: `/xp/:id`) para evitar conflitos de roteamento. 
✔ Como criar e utilizar DTOs (Data Transfer Objects) para definir a "forma" dos dados esperados no corpo de requisições POST ou PUT. 
✔ A necessidade de converter manualmente os dados recebidos via `@Param`, que são sempre do tipo `string`, para outros tipos como `number` quando necessário. 
✔ Como funciona o tratamento de exceções com blocos `try-catch` no NestJS e como lançar erros HTTP padrão, como `NotFoundException` (404) e `UnauthorizedException` (401). 
✔ Que é uma boa prática de design de API ter serviços modulares, mesmo que retornem dados semelhantes (como `getUser()` e `login()`), pois cada um tem uma responsabilidade distinta. 
✔ A importância de considerar a segurança da API desde o início, reconhecendo a necessidade de ferramentas como tokens (JWT) e criptografia em um projeto real.
✔ Como lidar com o tipo `Date`, que pode ser inicializado a partir de uma string no formato ISO, gerada com `new Date().toISOString()`.

## 💻 Modificações

- Criadas rotas principais da aplicação
- Modificado varias partes do frontend para se adaptarem ao backend
- Criados serviços no frontend para usar a API
- Criado DTO para guardar dados no banco de dados