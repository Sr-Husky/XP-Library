# Dia 15 –  

**Data:** 15/07/2025

## ✏ O que eu estudei/fiz hoje

- Primeiramente vou ver sobre a base teórica para tudo, eu já vi um pedacinho ontem, mas vamos resumir tudo:
	- JWT (JSON Web Token) é um token digital que autentica do usuário
	- Usuário envia login e senha
	- Se estiver certo, o servidor gera um JWT assinado e envia de volta
	- O cliente guarda esse token, no localStorage
	- Em requisições futuras o token é usado no `Authorization: Bearer <token>`
	- O backend valida o token antes de responder a rota
- Eu vou precisa de definir um tempo de validade para os tokens, e o servido irá gerenciar tudo de forma "stateless", ou seja, ele não guarda sessões, é tudo carregado pelo token
- Vou precisar instalar os seguintes módulos: `@nestjs/passport`, `@nestjs/jwt`, `passport`, `passport-jwt` e `@types/passport-jwt`
	- `passport`: É a biblioteca base e genérica de autenticação (como JWT, Google, Facebook, OAuth2), não faz nada sozinha, precisa de uma "estratégia"
	- `@nestjs/passport`: É o adaptador para fazer o passport funcionar de forma integrada com o nest, facilita o uso de decorators como `@UseGuards(AuthGuard('jwt'))`.
	- `@nestjs/jwt`: É oque vai fornecer e validade o `jsonwebtoken`, ele fornece o JwtService que vai me permitir gerar tokens com o `sign()` e validar com o `verify()`
	- `passport-jwt`: Isso daqui é oque eu vou usar para construir a minha estratégia no arquivo `JwtStrategy`, pra autenticar os usuários com base em JWT
	- `@types/passport-jwt`: Como a biblioteca `passport-jwt` vem toda escrita em JS, o nest precisa de ter os tipo em Typescript
- A primeira coisa que vou fazer é criar todos os arquivos iniciais, que é os arquivos do modulo "auth" (module, service e controller), e o "JwtStrategy"
- Após cria-los eu vou configurar o arquivo `auth.module.ts`:
	- Importar o `PassportModule` que vou usar para colocar nos imports do modulo, pois vou precisar de usar `UseGuards(AuthGuard('jwt'))`
	- Importar o `JwtModule` que é para eu poder registrar uma configuração para os tokens do meu JWT:
	- Importar o "JwtStrategy" do arquivo que eu criei (ainda não tem tem nada nessa classe) que vai ser colocado como um provedor do modulo, assim como o "service"
	- Na configuração do modulo eu monto tudo:
		- `@Module({`
			  `imports: [`
			    `PassportModule,`
			    `JwtModule.register({`
			      `secret: 'chave_secreta',`
			      `signOptions: { expiresIn: '1h' },`
			    `}),`
			  `],`
			  `providers: [AuthService, JwtStrategy],`
			  `controllers: [AuthController],`
			`})`
	- Aqui na configuração do module eu importo o `PassportModule` e o `JwtModule` (preciso importar aqui pois são módulos externos que vou usar), no caso do `JwtModule` eu importo na verdade uma instancia do modulo que já vem com o `secret` (chave secreta que vou usar para assinar os tokens) e `signOptions` que onde eu especifico as opções, que no caso é a duração dos tokens que é de 1h, o resto é padrão (configuração dos providers e controllers) exceto pelo fato de ter mais um provedor que será o arquivo de estratégia.
- Agora vou para a configuração do `auth.service.ts`:
	- Primeiro eu preciso importar o JwtService para usar o "sign" que é para assinar e gerar o token, pois aqui no service eu vou criar as funções que vao validar e logar o usuário
	- Vou criar a função `validateUser()` que vai receber o login e a senha, e vai validar se o login existe e se a senha esta correta, ao validar ele vai retornar um objeto do "user"
	- Vou criar a função `login()` que vai receber o objeto do user e vai gerar um token, esse token vai ser um payload com o id e o username do usuário, e que vai ser assinado com a chave secreta, isso será feito pela função `sign()` do JwtService que eu injetei na função AuthService
- Para terminar a logica do do login eu vou agora para o `jwt.strategy.ts`:
	- Oque eu vou fazer nesse arquivo é meio complexo, fiquei um bom tempo pensando pra entender, é o seguinte, eu vou usar o modulo `'@nestjs/passport'`  para aplicar a estratégia, ele é meio que a base genérica que vou usar, e agora a própria estratégia que vai vim do `'passport-jwt'`
	- Eu vou importar a função PassportStrategy de `'@nestjs/passport'` e a classe Strategy de `'passport-jwt'`, essa função PassportStrategy vai receber um parametro que sera a propria estratégia que ele vai montar em cima da base
	- `export class JwtStrategy extends PassportStrategy(Strategy){}`
		- Nessa linha eu crio uma classe JwtStrategy que vai estender essa classe que vai ser retornada do PassportStrategy, essa classe retornada já vai ser uma classe que está registrada no Nest, ele vai registrar isso em algum lugar e associar ao nome 'jwt' por padrão, em outra parte do codigo eu vou poder escrever um codigo que diz algo como "quero usar a estratégia 'jwt'" e então o Nest já vai enteder que se trata da função JwtStrategy nos criamos, pois é ela que foi registrada correspondendo ao nome 'jwt', resumindo, o JwtStrategy é uma versão da PassportStrategy (que é a função basica que já vem pronta), uma versão que usa a estratégia "Strategy" que veio do `'passport-jwt'` que é a biblioteca que tem a estratégia que lida com JWT
	- Nessa classe que criei (`JwtStrategy`) eu vou usar a base da "PassaportStrategy" porem adáptada com a estratégia para o JWT e agora eu vou personalizar essa estratégia:
		- Dentro do construtor dessa classe eu vou configurar as estratégia usando a função `super()`
			- `export class JwtStrategy extends PassportStrategy(Strategy){`
			    `constructor(){`
			        `super({`
			            `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),`
			            `ignoreExpiration: false,`
			            `secretOrKey: "chave_secreta"`
			        `});`
			    `}`
		- Essa função vai apenas configurar onde que será buscado o token, a verificação da validade e ira usar chave secreta para fazer as verificações do token
		- Além do construtor eu também vou adicionar uma função que é a "validate()" que será chamada automaticamente, essa função será meio que o retorno da verificação do token, se a verificação for bem sucedida e o acesso for legitimo, ele vai retornar um objeto com id e usuário, que será o objeto que será colocado no meio da requisição
	- Resumindo o fluxo, eu vou usar o decorator `@UseGuards(JwtAuthGuard)` em todas as rotas do controller que eu quiser proteger, ao usar isso, ele sempre vai chamar primeiro essa verificação antes de passar a requisição direto para a função especificada na rota, na verificação ele irá pegar o token que vai estar no campo "headers" da requisição, e ira chamar a classe `JwtAuthGuard`, que é uma classe que eu criei que tem apenas essa linha:
		- `export class JwtAuthGuard extends AuthGuard('jwt'){}`
	- que é simplesmente uma classe que estende o AuthGuard que é oque vai organizar tudo referente a autenticação usando a estratégia "jwt" que esta registrada como a classe que nos criamos (`JwtStrategy`)
	- O fluxo vai ser o seguinte:
		- Front faz uma requisição a um rota protegida do back, uma requisição post com token no header da requisição
		- Backend recebe a requisição no controller e, antes de começar a executar oque está programado para aquela rota, ele irá chegar os decorators, e interceptar a requisição se for necessário
		- Antes de chamar a função que trata a requisição ele ira encontrar o "`@UseGuards(JwtAuthGuard)`"
		- Irá invocar a classe `JwtAuthGuard` que é uma extensão do AuthGuard porem usando a estratégia 'jwt'
		- O AuthGuard ira buscar qual é a estratégia 'jwt' e vai encontrar a classe `JwtStrategy`
		- Porem essa classe também estende outra classe, que é retornada pela função `PassportStrategy()`, que por sua vez recebe a estratégia como parametro
		- Então PassportStrategy() vai receber Strategy como parametro que é a estratégia para lidar com JWT, ela vai construir a classe com a base da estratégia, e o JwtStrategy vai ser uma versão expandida dessa classe construida, essa versão vai ter a configuração certinha de como eu quero a estratégia, e vai retornar um payload com o id e o usuário do user caso, ao ser usada para validação, o token seja aceito
		- Essa estratégia toda construida vai estar no JwtStrategy, que será a estratégia que o AuthGuard vai usar para construir a logica da autenticação, a classe `JwtAuthGuard` vai estender justamente essa versão do AuthGuard com toda a estrategia aplicada na logica de autenticação. E assim eu so preciso de chamar o JwtAuthGuard para usar uma versão do AuthGuard que aplica minha estratégia
		- Ao validar o token, o AuthGuard vai criar o campo user na requisição, que pode ser acessado em "request.user", nesse campo da requisiçao vai estar o retorno da estratégia que o objeto com o id e o usuário. 
		- E então agora sim ele vai passar a requisição, com essa adição, para a função que voce programou para tratar a requisição naquela rota
- Como diz acima nos vamos ter que ter a classe JwtAuthGuard, que vai ser declarada no arquivo "`jwt-auth.guard.ts`" que vai ter apenas importar "Injectable" do Nest e "AuthGuard" que vem de `@nestjs/passport`, e a única linha que vai ter é essa:
	- `export class JwtAuthGuard extends AuthGuard('jwt'){}`
	- Porem declarada com o decorator "`@Injectable()`"
- Passei algumas horas atualizando tudo, meu Deus do ceu onde já se viu tanto erro, tanto por coisas especificas de sintaxe que eu não sabia, quanto por erros bestas, consegui atualizar todas as partes do código que precisam de autenticação, agora eu so preciso fazer a parte da encriptação da senha que acredito que vai ser muito facil, enfim, so detalhando um pouco como foi atualizar tudo, eu tive que tirar o parâmetro "id" de vários requests pois eu já consigo obter o id pela autenticação, ou seja, eu mando um token e eu consigo descobrir o id do usuário que enviou o token, isso é facilmente decodificável, não é como criptografia como eu estava pensando, mas é seguro mesmo assim, pois não da pra gerar o token valido sem a chave secreta.
- Acabei de implementar como eu pensei é super facil, eu so preciso instalar o modulo como comando `npm install bcrypt`, depois usar `bcrypt.hash(dto.senha, 10)` que significa aplicar o algoritmo que faz o hash 10 vezes, então esse hash eu guardo como a senha, e ai quando eu for logar, eu pego a senha digitada e comparo usando `bcrypt.compare(senha, user.senha)`, e isso vai fazer o hash da senha digitada quantas vezes for preciso e comparar com oque está no banco de dados, assim como eu estava fazendo porem com a senha normal
- Sobre a quantidade de saltos ele precisa fazer para comparar, essa informação já esta no hash, ele sempre começa com `$2b$` que é a versão do bcrypt e depois vem `10$` que é o número de saltos.
- Eu usei um console.log no hash das senhas que eu colocava no login para ver o hash das senhas dos dados mockados que já estavam no banco de dados, então substitui cada senha pela sua versão hash

## 💡 O que eu aprendi

✔ O fluxo completo de autenticação com JWT, desde o login e geração do token até seu envio no cabeçalho `Authorization` e validação no back-end. 
✔ A função de cada módulo no ecossistema de autenticação do NestJS: `passport` (base), `@nestjs/passport` (integração), `@nestjs/jwt` (geração/validação de token) e `passport-jwt` (estratégia específica). 
✔ Como configurar um módulo de autenticação (`AuthModule`), registrando o `JwtModule` com uma chave secreta (`secret`) e tempo de expiração (`expiresIn`) para os tokens. 
✔ Como construir uma `JwtStrategy` customizada, estendendo `PassportStrategy`, para definir como o token JWT é extraído da requisição e validado com a chave secreta. 
✔ O papel da função `validate()` dentro de uma estratégia, que é responsável por receber o payload decodificado do token e retornar os dados do usuário que serão anexados à requisição. 
✔ Como criar e aplicar um Guard de autenticação (`@UseGuards(JwtAuthGuard)`) para proteger rotas específicas da API, acionando a lógica de validação do token. 
✔ Como refatorar rotas para obter o ID do usuário de forma segura a partir do token autenticado (`request.user`), em vez de recebê-lo como um parâmetro de rota ou corpo da requisição. 
✔ Como implementar a segurança de senhas usando a biblioteca `bcrypt` para gerar um hash (`bcrypt.hash`) antes de salvar no banco de dados e para comparar senhas de forma segura (`bcrypt.compare`) durante o processo de login.

## 💻 Modificações

- Instalados módulos de dependência para autenticação
- Criado modulo de autenticação `auth` e outros arquivos correlatos
- Refatorada todas as chamadas para a API para usarem autenticação
- Implementado transformação de senhas em hash
