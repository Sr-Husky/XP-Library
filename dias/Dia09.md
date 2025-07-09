# Dia 09 –  **Listagem Pública de experiências**

**Data:** 09/07/2025

## ✏ O que eu estudei/fiz hoje

- Agora chegou a hora de criar os modulo que vão tratar os dados que o Nest receber, primeiramente vou começar executando aqueles comandinhos para criar automaticamente os módulos:
	- `nest g module user`
	- `nest g controller user`
	- `nest g service user`
- Esses comando criaram a pasta user com:
	- `user.controller.spec.ts`: Arquivo de teste automatizado com Jest
	- `user.controller.ts`: Onde ficam as rotas HTTP (`GET`, `POST`, `PUT`, `DELETE`). O controller recebe as requisições do frontend e repassa para o service.
	- `user.module.ts`: Define o módulo do usuário. Aqui eu registro os serviços e controllers relacionados ao usuário
	- `user.service.spec.ts`: Arquivo de teste automatizado com Jest
	- `user.service.ts`:Aqui vai a lógica da aplicação relacionada ao usuário. O controller chama esse service para buscar dados, salvar, deletar etc.
- Além disso foi modificado o `app.module.ts` para importar o modulo do "user", se ele não fosse importado ali o Nest nem ia carregar o modulo com o controller  e o service dos usuários
- Executei os mesmo comando para criar o modulo do "xp"
- Funciona assim, quando eu executar o `npm run start:dev`, o primeiro código a ser executado será o do `main.ts` no backend, nesse código nos temos a linha `await app.listen(process.env.PORT ?? 3000);` que servirá para criar o servidos, mas antes nos precisamos carregar os módulos da api, que será feito na linha `const app = await NestFactory.create(AppModule);` essa linha irá chamar a função `create()` de `NestFactory` que foi importado do modulo do Nest que foi instalado via npm, essa função recebe o AppModule como parâmetro que é a classe de modulo exportada pelo app.module, resumindo, eu chamo uma função do nucleo do Nest para AppModule que é a classe que é exportada no app.module, que é uma classe que esta declarada (sem corpo) com o Decorator `@Module` que especifica que aquela classe é um módulo, esse será o primeiro modulo que será carregado, e para que eu possa carregar todos os outros módulos, eu vou carregar eles como import do primeiro modulo, ou seja, ele vai carregar o AppModule e também todos os modulos que ele está importando como "depêndencias" desse modulo, na pratica, no decorator da classe que o app.module.ts exporta, eu vou importar todos os meu módulos (user e xp) no campo 'imports' do Decorator, esses módulos são aqueles que eu criei que possuem seus serviços, e também é especificado o controlador e o serviço como todo modulo deve ter, que no caso do app.module, ele usa o controlador do arquivo app.controller.ts, e nesse arquivo, o controlador está definido assim: `@Controller()`, no campo dentro dos parênteses voce coloca a rota, quando voce não coloca nada, quando eu enviar alguma requisição para a porta raiz da minha api (localhost:3000), no caso ela ja vem programada como padrão para mostrar só um hello world para requisições get, ou seja se voce entrar pelo navegador ele vai fazer uma requisição get e será retornado só o hello world na tela, já os módulos que são importados a partir do app.module.ts possuem os controllers especificando a rota que devem controlar, no caso do user.module.ts, ele vai usar o controlador do arquivo user.controller.ts que tem o controlador especificado assim `@Controller('user')`, ou seja, ele irá controlar a rota "localhost:3000/user".
	- Alem dos módulos que eu vou usar para consultar o banco de dados eu tenho que criar um modulo para o prisma, esse modulo não terá um "controller" pois ele só servira para importar as funções do prisma de consulta ao banco de dados, então nós os teremos o `prisma.module` que será onde declararemos o modulo (que será importado no modulo AppModule) e o `prisma.service` que é onde nos exportaremos uma classe com nome "PrismaService" que será uma extensão da classe "PrismaClient" que é importado do modulo que instalamos via npm do '@prisma/client', essa extensão da classe irá incluir os metodos onModuleInit() e onModuleDestroy() que são importados do Nest e que irão ser chamados no inicio do modulo para iniciar a conexão e quando finalizar o modulo para finalizar a conexão do prisma com o banco de dados
	- Eu também preciso usar o comando `npx prisma generate` para que seja gerado o arquivo do provedor PrismaClient que eu vou usar no meu módulo, esse provedor é especificado em `generator client` la no schema.prisma.
- Para tudo isso funcionar nos precisamos de definir no main.ts que a nossa api pode receber requisições de domínios externos, para isso nos habilitamos o CORS (Cross-Origin Resource Sharing) que é uma política de segurança dos navegadores que impede que uma página web faça requisições para um domínio diferente daquele que carregou a página, para habilitar basta chamar o método `enableCors()` antes de iniciar o servidor
- Feito isso agora é so criar escrever o código dos meus próprios módulos usando as funções do prisma:
	- `xp.module.ts`:
		- Eu importo o Decorator `Module` de '@nestjs/common' e importo a classe do meu controlador `XpController` de `xp.controller.ts` e a classe do meu serviço `XpService` de `xp.service.ts`, agora eu crio uma classe vazia com o nome do meu modulo, e coloco o Decorator "@Module" em cima para especificar que essa classe é um modulo, e no proprio decorator eu especifico quais serão os controladores e os provedores, ou seja, os "controller" e os "service" que fazem parte do modulo, a sintaxe é assim:
		- `@Module({`
		-     `controllers: [XpController],`
		-     `providers: [XpService]`
		- `})`
		- `export class XpModule {}`
		- Pronto, esse é o modulo, e agora é so eu escrever o `XpService`, e depois associar cada método da minha classe `XpService` a uma rota, e isso será feito na classe `XpControler`
	- `xp.service.ts`
		- Eu importo o Decorator `@Injectable` para usar na minha classe, pois esse decorator faz a classe ser injetável em outras classes, pois eu vou ter que injetar ela na minha classe do controller (que vai chamar os métodos dela), é como se eu pegasse todos os métodos que eu declarar nessa classe e passasse eles para a classe do controller, e ai o controller fica tendo os controladores para as rotas e chamando os ""próprios"" métodos para tratar cada rota
		- Eu importo também o prisma service que vou injetar na classe dos serviços, pois vou usar os métodos do prisma nos métodos do meu serviço (sim o prisma.service declara a classe como injetável)
		- Agora eu crio uma classe como decorator `@Injectable()` e ja declaro a classe no export assim: `export class XpService{ <conteudo> }`
		- Para injetar a classe do prisma que eu fiz no prisma.service eu vou usar o metodo constructor() da classe assim:
		- `constructor(private readonly prisma: PrismaService) {}`
		- Assim que a classe é declarada ela chama o construtor que recebe um parâmetro com nome prisma do tipo "PrismaService" que é a classe, ela esta como "private" e "readonly" por motivos autoexplicativos e boas práticas.
		- Agora eu já posso colocar meus métodos:
			- `async listarPublicas(busca?: string, tags?: string[])`
				- Esse método servirá para buscar todas as experiências publicas no banco de dados, inclusive com a opção de usar filtros de busca e tags, para isso ele irá receber um parâmetro opcional que irá guardar a string da busca, e outro parâmetro que irá guardar um vetor das strings das tags
				- Esse meu método vai retornar o retorno que o prisma der da busca, para chamar o método do prisma eu fiz assim:
				- `this.prisma.xp.findMany()`: Isso significa: "desta classe (this), chame o método "`findMany()`" do objeto "xp" (que equivale ao schema da minha tabela e que está conectado com o banco de dados)". Já a função `findMany()` serve para obter a tabela toda, porem voce pode filtrar o `findMany()` passando alguns parâmetros para ele, e é oque eu vou fazer caso eu passe os parâmetro de busca ou tags para meu serviço
				- Para filtrar voce precisa passar um objeto como parâmetro, esse objeto precisa ter o campo "where", aqui um exemplo:
					- `{ where: { AND: [ codição 1, condicão 2, ... ] } }`
					- Nesse exemplo acima eu estou enviando no parâmetro um filtro que só irá pegar a linhas cuja TODAS as condições do AND sejam satisfeitas. As condições que eu quero são:
						- Se tem o campo "busca", ele deve apenas para o casos em que o texto de "busca" esteja no texto OU no contexto
						- Se tem o campo "tags", ele deve buscar apenas para casos em que todas as tags descritas estão em entre as tags da experiência
						- A experiência deve estar pública
					- Eu vou colocar todas elas no AND, pois todas elas devem ser verdadeiras, a condição do campo de busca vai ficar assim dentro do AND:
						- `OR: [`
						- `    { texto: { contains: busca, mode: 'insensitive' } },`
						- `    { contexto: { contains: busca, mode: 'insensitive' } }`,
						- `]`
						- Isso significa que, no campo "texto" deve conter o texto de "busca", no modo "case insensitive" ou seja, sem fazer distinção de maiúsculo e minúsculo, isso é feito para ver se tem a busca OU no "texto" OU no "contexto"
							- Porem isso deve ser feito apenas se tiver o parâmetro "busca", então voce pode usar o operador ternário, que ficaria assim `busca ? { OR: [...] } : {}`
							- Ou seja, se tem "busca" faz a condição, senão, ignora o filtro (precisa ser `{}` vazio para ignorar)
						- Já a condição dos tags ficará assim:
							- `tags: { hasSome: tags }`
						- Isso significa que, no capo tags do banco de dados tem que ter todas as "tags" do parâmetro
							- Porem isso deve ser feito apenas se tiver o parâmetro "tag" e se ele for > 0, então voce pode usar o operador ternário, que ficaria assim `(tags && tags.length > 0) ? { ... } : {}`
							- Ou seja, se tem o vetor "tag" e ela é maior do que 0, faz a condição, senão, ignora o filtro (precisa ser `{}` vazio para ignorar)
						- Já a condição da experiência publica ou não fica assim:
							- `{ pub: true}`
						- Que quer dizer que ele deve pegar apenas onde "pub" for igual a true
					- Isso tudo só no campo do AND,  que está dentro "where"
				- Além do "where" eu vou usar também o "orderBy" para definir uma ordem que os dados serão entregues:
					- `orderBy: { mod: 'desc' }`
					- Isso quer dizer que serão entregues em ordem de modificação descendente
		- Aqui vai outras funções além `findMany()` que eu posso usar:
			- `findUnique`: Busca um único registro por campo único (ex: id)
				- ```prisma.user.findUnique({
					  where: { id: 1 },
					  include: { experiencias: true },
					})```
				- Só funciona com campos **únicos** (`@id`, `@unique`)
			- `findFirst`: Busca o primeiro que bate com os filtros
			- `findMany`: Busca vários registros, com filtros, ordenação, etc
				- ```prisma.xp.findMany({
					  where: { ... },
					  orderBy: { campo: 'asc' | 'desc' },
					  skip: 10,      // pular x registros
					  take: 20,      // pegar x registros
					  include: { ... },  // incluir relações
					  select: { ... },   // selecionar campos específicos
					})```
			- `create`: Cria um registro
				- ```prisma.xp.create({
					  data: {
					    texto: '...',
					    contexto: '...',
					    tags: ['vida', 'força'],
					    user: { connect: { id: 1 } }, // relação
					  }
					})```
			- `createMany`: Cria vários registros de uma vez
			- `update`: Atualiza um único registro por campo único
				- ```prisma.xp.update({
					  where: { id: 10 },
					  data: { texto: 'atualizado' }
					})```
			- `updateMany`: Atualiza todos os registros que batem com o filtro
			- `delete`: Deleta um único registro por campo único
				- ```prisma.xp.delete({
					  where: { id: 10 }
					})```
			- `deleteMany`: Deleta vários registros com base em um filtro
			- `upsert`: Atualiza se existir, cria se não existir
				- ```prisma.user.upsert({
					  where: { email: 'email@x.com' },
					  update: { nome: 'Novo Nome' },
					  create: { email: 'email@x.com', nome: 'Novo Nome' }
					})```
			- `count`: Conta quantos registros batem com um filtro
				- ```prisma.xp.count({
					  where: { pub: true }
					})```
			- `aggregate`: Faz operações como count, avg, sum, min, max
				- ```prisma.xp.aggregate({
					  _count: true,
					  _avg: { likes: true },
					  _max: { mod: true },
					  where: { pub: true }
					})```
			- `groupBy`: Agrupa registros com base em campos, com agregações
				- ```prisma.xp.groupBy({
					  by: ['id_user'],
					  _count: { _all: true },
					  where: { pub: true }
					})```
		- No `where`, eu posso usar:
			- Comparação:
				- `equals`
				- `not`
				- `in`, `notIn`
				- `lt`, `lte`, `gt`, `gte`
				- `contains`, `startsWith`, `endsWith`
				- `mode: 'insensitive'` (para strings)
			- Lógicos:
				- `AND`, `OR`, `NOT`
			- Arrays:
				- `has`, `hasSome`, `hasEvery`, `isEmpty`
	- `xp.controller.ts`
		- Para finalmente fazer o controller eu vou:
			- Importa os **decorators** e ferramentas do NestJS que serão usados:
			    - `@Controller()` → define uma rota base (prefixo)
			    - `@Get()` → define uma rota GET
			    - `@Query()` → extrai valores da URL (`?param=...`)
			- Importa o service que vai fazer a lógica da busca no banco de dados: `import { XpService } from './xp.service';`
			- Usar o decorator `@Controller('xp')` para criar a classe
				- Define o prefixo da rota para esse controller.
				- Todas as rotas dentro desse controller começam com `/xp`.
			- `constructor(private readonly xpService: XpService) {}` Injetar o serviço injetável que acabei de criar
			- `@Get('publicas')`: Define que essa função trata a rota GET em `/xp/publicas`.
			- ```listarPublicas(
				  @Query('busca') busca?: string, 
				  @Query('tag') tag?: string
			  )```
				- Esse método será chamado quando alguém acessar `/xp/publicas`.
				- Os parâmetros da query string (como `?busca=...&tag=...`) são extraídos com `@Query()`.
				- `busca` e `tag` são **opcionais**, por isso o `?`
			- `const tags = tag?.split(',');`
				- Se `tag` foi passada, ela será uma string como `"vida,força"`. Aqui, a string é transformada em um **array de strings**:
				- Se `tag` for `undefined`, `tags` será `undefined`.
			- `return this.xpService.listarPublicas(busca, tags);`
				- - Chama o método `listarPublicas()` do `XpService`.
				- Passa os filtros (`busca`, `tags`) para que o service consulte o banco com o Prisma.
				- O NestJS retorna automaticamente o resultado como JSON.
		- Decorators de Método HTTP (rota):
			- `@Get()`: GET - Buscar dados
			- `@Post()`: POST - Criar dados
			- `@Put()`: PUT - Substituir dados existentes
			- `@Patch()`: PATCH - Atualizar parcialmente
			- `@Delete()`: DELETE - Remover dados
			- `@Options()`: OPTIONS - Ver opções da rota
			- `@Head()`: HEAD - Cabeçalhos apenas (sem body)
		- Decorators de Parâmetros da Requisição
			- @Param(): Pega valor da URL (/rota/:id) - `@Param('id') id: string`
			- @Query(): Pega valor da query string (?busca=x) - `@Query('busca') busca: string`
			- @Body(): Pega o corpo da requisição (POST/PUT/PATCH) - `@Body() dto: CreateXpDto`
			- @Headers(): Pega os headers da requisição - `@Headers('authorization') token: string`
			- @Req(): Pega o objeto da requisição inteiro - `@Req() req: Request` (do Express)
			- @Res(): Pega o objeto de resposta (Response) - `@Res() res: Response` (uso avançado)
			- @Ip(): Pega o IP do cliente - `@Ip() ip: string`
			- @HostParam(): Lê o subdomínio (para rotas com host binding) - `@HostParam('account') account: string`
		- Decorators de classe
			- @Controller(): Marca uma classe como controller
			- @Injectable(): Marca uma classe como service injetável
			- @Module(): Marca uma classe como um módulo NestJS
		- Decorators de Segurança (autenticação/autorização)
			- @UseGuards(): Aplica guardas (ex: autenticação)
			- @SetMetadata(): Define metadados para decorators custom
			- @Roles(): Restringe por papel (com RolesGuard)
			- @Headers(): Captura headers como token
		- Exemplo de uso:
		- ```@Controller('xp')
		  export class XpController {
			  constructor(private readonly xpService: XpService) {}
			  @Get(':id')
			  getPorId(@Param('id') id: string) {
			    return this.xpService.buscarPorId(Number(id));
			  }
			  @Post()
			  criar(@Body() dados: CriarXpDto) {
			    return this.xpService.criar(dados);
			  }
			  @Get('publicas')
			  listar(@Query('busca') busca?: string) {
			    return this.xpService.listarPublicas(busca);
			  }
		  }```
- Feito toda a programação dos módulos, agora eu so preciso iniciar o meu backend com `npm run start:dev`
- Se o prisma já estiver configurado, ele já vai se conectar com o banco de dados (que já deve estar online no docker composer) e aí eu já posso começar a fazer as requisições
- Eu coloquei os dados mockados manualmente no banco de dados para fazer os testes
- Entrando no endereço "`http://localhost:3000/xp/publicas`", o navegador por padrão enviou um GET e na tela já apareceu todo o meu banco de dados de experiências em json
- Para pesquisar algo eu so preciso passar a query "busca" por exemplo "`http://localhost:3000/xp/publicas?busca=texto`", isso já funciona e o nest retorna apenas as correspondências exatas, e eu também posso filtrar por tags, assim: "`http://localhost:3000/xp/publicas?tag=%23tag1`", isso também ja funciona (%23 significa a "#", demorei um tempo pra descobrir que era por isso que as buscas feitas direto pelo navegador não estavam dando certo)

## 💡 O que eu aprendi

✔ Como usar a CLI do NestJS para gerar automaticamente a estrutura de módulos (`module`), controladores (`controller`) e serviços (`service`). 
✔ O fluxo de inicialização de uma aplicação NestJS, desde a execução do `main.ts` até o carregamento do `AppModule` raiz e dos módulos de funcionalidades que ele importa.
✔ Como estruturar a aplicação com o decorator `@Module`, que organiza e conecta os controladores e os serviços (`providers`) de uma funcionalidade específica. 
✔ A importância e como habilitar o CORS (`enableCors()`) no back-end para permitir que o front-end, em outro domínio, possa fazer requisições à API. 
✔ Como criar um serviço com o decorator `@Injectable()` para conter a lógica de negócio e como injetar outras dependências, como o `PrismaService`, através do construtor da classe. 
✔ A utilização avançada do Prisma Client para realizar consultas complexas, especialmente com `findMany`, combinando filtros no `where` com operadores lógicos (`AND`, `OR`), condições em strings (`contains`, `mode: 'insensitive'`) e arrays (`hasSome`), além de ordenação (`orderBy`). 
✔ Como criar um controlador com o decorator `@Controller()` para definir as rotas da API e como associar métodos a verbos HTTP, como o `@Get()`. 
✔ Como extrair dados de uma requisição web, especificamente parâmetros da query string (ex: `?busca=...`), utilizando o decorator `@Query()` nos métodos do controlador. 
✔ O ciclo completo para criar um endpoint funcional: programar a consulta ao banco de dados no serviço, expor essa lógica através de um método no controlador e testar a rota diretamente pelo navegador. 
✔ A necessidade de executar `npx prisma generate` para que o Prisma Client gere os tipos atualizados do TypeScript sempre que o `schema.prisma` for modificado.

## 💻 Modificações

- Criado módulos "user" e "xp"
- Banco de dados foi preenchido com dados de teste
- "@prisma/client" configurado
- Programada rota GET para experiências
- Modificado frontend para receber os cards do backend na página "home"

