# Dia 17 – **Autorização por Roles e Refino no Backend**

**Data:** 17/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje vou implementar o sistema de Roles, onde um usuário pode ser:
	- "USER" - Tem permissão de alterar apenas os próprios dados
	- "ADMIN" - Tem permissão de alterar tudo
- Para implementar isso eu vou criar um Decorator chamado "Roles", os decorator adiciona metadados na rota, que é oque eu vou usar para restringir ou liberar o acesso
- Para ler os metadados eu vou criar um "Guard" que lê a metadata e verifica se o usuário tem o role exigido
- Primeiramente, criando o decorator, vou criar o arquivo `roles.decorator.ts`
	- `import { SetMetadata } from "@nestjs/common";`
		- Essa função `SetMetaData` é do Nest e serve para anexar metadata em rotas, classes ou métodos
	- `export const ROLES_KEY = 'roles';`
		- Esse vai ser o nome do metadado, essa string será usada para identificar o dado que vou inserir
	- `export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);`
		- Aqui eu crio uma função chamada "Roles" que recebe varias strings e coloca numa lista de string, e então essa função chama a função `SetMetadata()` para adicionar essa lista de strings aos metadados com o identificador "ROLES_KEY"
- Agora que o decorator esta pronto nos vamos precisar ler esses metadados com o Guard e verificar se as permissões do usuário são as exigidas pela rota
- Um "Guard" é uma classe que implementa um interface chamada `CanActive` que serve para bloquear ou permitir o acesso a uma rota, o papel dele vai ser disparar um erro 403 (Forbidden) quando o usuário não tiver permissão
- Vou criar o arquivo `roles.guard.ts`:
	- `import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";`
		- `Injectable`: Para dizer ao Nest que essa classe pode ser injetada (como qualquer provider)
		- `CanActivate`: Interface que obriga a classe a implementar o método `canActivate()`
		- `ExecutionContext`: Objeto que dá acesso ao contexto da requisição (req, handler, class, etc)
		- `Reflector`: Classe especial do que vou usar para ler os metadados que coloquei com `SetMetadata()`
	- `export class RolesGuard implements CanActivate {}`
		- Essa classe é declarada usando o decorator `Injectable`, implementando a interface `CanActivate`
	- `constructor(private reflector: Reflector) {}`
		- Preciso construir também o Reflector para usar seus métodos
	- `canActivate(context: ExecutionContext): boolean {}`
		- Essa vai ser a função que ira retornar true se o usuário tiver permissão, e lançar um erro se o usuário não tiver permissão
		- Ela recebe como parâmetro uma classe do tipo `ExecutionContext`, essa classe serve para pegar varias informações do contexto de execução de uma rota ou ate mesmo do controller todo, entre as informações que voce pode pegar estão:
			- O tipo de contexto (HTTP, WebSocket, RPC...)
			- O handler da rota (função que está sendo chamada no controller)
				- Por exemplo, se voce tem o seguinte codigo:
					- `@Delete(':id')`
					- `@Roles('ADMIN')`
					- `deleteExperiencia() {}`
				- Nesse codigo acima o handler (que pode ser obtido pelo metódo `getHandler()`) seria a função `deleteExperiencia()`
			- A classe do controller
				- Esse daqui se refere a classe toda, por exemplo, o meu controller do módulo de xp ta assim:
					- `@Controller('xp')`
					- `export class XpController {}`
				- Então a classe é o `XpController` que pode ser obtido pelo método `getClass()` do `ExecutionContext`
			- O request (no caso de HTTP)
			- O response
			- Informações sobre argumentos e metadados
	- Dentro da função `canActivate()` eu vou precisar coletar os dados dos 'roles' ques estão nos metadados, para isso vou usar o método do `Reflector` que procura informações no contexto, que será:
		- `this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler, context.getClass])`
			- No primeiro parâmetro eu coloco o identificador que estou procurando e no segundo parâmetro eu coloco um array de lugares para procurar, que no caso é nos metadados da função daquela rota especifica e tambem nos metadados da classe
		- Esses valores encontrados eu vou guardar numa variável chamada "requiredRoles"
	- Então eu vou analisar, se a função de busca do `reflector` não encontrar nada eu vou liberar o acesso, porque isso significa que aquela rota não tem restrição de 'roles'
	- Agora eu preciso pegar quais são os 'roles' do usuário, vou fazer assim:
		- `const request = context.switchToHttp().getRequest();`
			- O método `switchToHttp()` serve para mudar o `ExecutionContext` genérico para um contexto HTTP, dado acesso a:
				- `getRequest()` → retorna o `req`
				- `getResponse()` → retorna o `res`.
				- `getNext()` → retorna o `next()`.
			- E no caso oque eu to usando é o `getRequest()` pois eu vou aproveitar que estou retornando o "user" no request do Guard do JWT e vou olhar no objeto se aquele usuário tem os 'roles' necessários
		- `const user = request.user;`
			- Pegando os objeto do usuário
		- `const hasRole = requiredRoles.includes(user.role);`
			- Verificando se o usuário tem os 'roles' necessários
	- `if (!hasRole) throw new ForbiddenException('Você não tem permissão');`
		- Se ele não tiver permissão, lança um erro 403
	- Caso ele realmente tenha permissão: `return true`
- Agora que o arquivo dos 'roles' já estão implementando eu só preciso atualizar o banco de dados com o novo atributo dos usuário e depois disso é só sair usando onde eu quiser e ser feliz
- Adicionei a linha `role Role @default(USER)` no modelo de tabela do "User", `Role` é um enum que pode receber ou 'USER' ou 'ADMIN'
- Pronto, já implementei o sistema de 'roles', não sei porque mas começou a dar erro em umas partes que não tem nada a ver, acho que de alguma forma eram erros que só não tinham aparecido antes
- Agora para implementar o sistema de Refresh token eu vou ter que mexer na estrutura de novo, basicamente ele deve funcionar gerando um token de tempo muito mais logo que o access token que eu já tenho, e esse token deve ser usado para acessar uma rota que vai gerar outro access token e outro refresh token, essa rota será requisitada sempre que o meu access token expirar
- Eu poderia criar outra tabela para guardar os refresh tokens, mas eu vou preferir colocar no User por simplicidade (já to achando as coisas complexas o suficiente).
- Comecei adicionando a linha `refresh String` no modelo do User no schema e fiz o migrate, depois modifiquei nos tipos de dados do frontend para ele receber o refresh token ao fazer requisições
- Na função de login do meu `auth.service.ts` eu vou adicionar uma nova funcionalidade: Gerar o refresh token usando o "sign()", guardar no banco de dados e depois retornar tudo (user, access token, refresh token) para o controller
- Bom, acabei de terminar tudo aqui, eu fiquei tão focado que esqueci de ir anotando aqui, isso tudo ta ficando muito complexo, desde o dia que eu criei aquele contexto eu estou com tudo meio nebuloso na cabeça é muito código engessado, que não tem muito oque pensar, é só usa aquela formula que dá certo, e sobre a organização de tudo, é algo que eu só vou conseguir pegar se eu praticar várias vezes, enfim, vou tentar revisar ou até mesmo replicar tudo sozinho sem nenhuma ajuda, além disso eu também vou focar nesses assuntos mais complexos nos próximos projetos que eu for fazer.
- Enfim, resumindo oque eu fiz, eu fiz a modificação no login do modulo Auth, agora ele gera dois tokens, um para o refresh e um para o acesso padrão, o refresh é guardado nos dados do usuário dentro do banco de dados (essa abordagem limita minha aplicação á suportar apenas um dispositivo conectado, mas para uma aplicação simples é o suficiente), alem disso o token refresh também é guardado no localStorage, ele tem a duração de 1 semana
- Criei um endpoint no auth para renovar o token, que é a rota "auth/refresh", ele recebe o token via body e compara o token recebido (que veio do localStorage) com o token do banco de dados do usuário, se for o mesmo, ele gera outro token para o usuário e outro refresh token, que é atualizado no banco de dados, e assim essa rota tem a funcionalidade de fazer o refresh de ambos tokens
- Na definição das configurações do axios no frontend, no arquivo `api.ts`, eu adicionei um interceptador da resposta para, caso dê algum erro, ele chame a função de dar refresh no token, e depois tente fazer a requisição que tinha dado erro novamente (no caso ele so faz isso quando dá erro 401 que muito provavelmente será apenas erros de autorização do token, quando ele vencer), para fazer isso eu usei o método `interceptors.response.use()` do axios, essa função recebe dois parâmetros obrigatórios, o primeiro é uma função que sera chamada caso a resposta seja do tipo 2xx, ou seja, quando der certo, e o segundo parâmetro é outra função que será chamada quando a resposta for do tipo != 2xx, ambas as funções recebem um parâmetro que é um objeto do axios, no caso da primeira função ela recebe um parâmetro com:
	- `data`: conteúdo da resposta (corpo);
	- `status`: código HTTP;
	- `headers`, `config`, `request`, etc
- No caso do segundo parâmetro ele recebe um objeto com:
	- `response`: o mesmo `response` descrito acima;
	- `config`: a configuração da requisição original;
	- `message`: mensagem da falha;
	- `code`: código de erro (`ERR_BAD_REQUEST`, etc).
- Como está escrito acima, em `config` nos temos a requisição original, no meu código eu pego essa requisição original e adiciono uma propriedade com nome "\_retry" com valor "true" que vai ser um flag pra eu saber caso o erro 401 ocorra de novo, para evitar um loop infinito
- No final, caso ocorra um erro durante esse interceptor, eu usou o `return Promise.reject(e);` que serve para propagar o erro para o próximo catch ou interceptor acima, assim como o throw faria, porem o throw é mais usado em casos gerais, fora de promessas explicitas, esse outro método é o padrão para catch ou interceptors que retorna `Promise<never>` com status `"rejected"`.
- Eu também aproveitei para colocar a chave secreta do JWT no arquivo .env, tive que adicionar mais um modulo usando `npm install @nestjs/config` e então no arquivo `app.module.ts` eu importei ele de modo global
	- `imports: [ConfigModule.forRoot({isGlobal: true})]`
- No `auth.module.ts` eu tive que trocar a função `register()` por `registerAsync()` para que eu possa, ao invés de coloca um objeto estático, poder colocar um objeto dinâmico que é carregado durante a inicialização usando a função `useFactory()` que receberá os injetáveis de `ConfigService` para pegar os dados dos arquivos .env pois ele é executado dentro do boot do modulo. Também tive que mudar no arquivo de estratégia.

## 💡 O que eu aprendi

✔ Como implementar um sistema de autorização por roles (funções) no NestJS, distinguindo usuários `USER` e `ADMIN`. 
✔ Como criar um decorator customizado (`@Roles`) usando `SetMetadata` para anexar permissões necessárias a uma rota. 
✔ Como construir um `Guard` (`RolesGuard`) para ler os metadados de uma rota com o `Reflector` e verificar se o role do usuário autenticado corresponde ao exigido. 
✔ O fluxo de um sistema de refresh token, onde um token de longa duração é usado para obter um novo token de acesso sem a necessidade de um novo login. 
✔ Como modificar a lógica de login para gerar e retornar tanto um `access token` quanto um `refresh token`, armazenando este último no banco de dados. 
✔ Como usar interceptors do Axios no frontend (`interceptors.response.use`) para capturar erros de requisição, como o de token expirado (401). 
✔ A lógica para, dentro de um interceptor, chamar automaticamente a rota de `refresh`, atualizar os tokens no cliente e reenviar a requisição original que falhou. 
✔ Como mover dados sensíveis, como a chave secreta do JWT, para um arquivo `.env` e acessá-los no NestJS usando o `@nestjs/config`. 

## 💻 Modificações

- Adicionado decorator e guard para implementar sistemas de 'roles'
- Modificado vários endpoints para usar o novo sistema de 'roles'
- Atualizado banco de dados adicionando campo 'roles' e campo 'refresh'
- Adicionado sistema para recarregar tokens automaticamente sem precisar de login
- Criado novo endpoint `auth/refresh` para chamar o sistema 'refresh'
- Criado interceptor para interceptar erros 401 e chamar o serviço 'refresh'
- Modificado arquivos do JWT para usar o `.env`
