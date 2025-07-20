# Dia 20 - **Escrevendo os Primeiros Testes (Backend)**

**Data:** 20/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje é o dia que eu vou escrever alguns testes, mas especificamente serão testes unitários de um serviço e testes E2E para um controller.
- Começando pelos testes unitários, eu abri o arquivo `user.service.spec.ts` e me deparei com uma estrutura já pronta, vamos entender oque já está la:
	- `import { Test, TestingModule } from '@nestjs/testing';`
		- importa as ferramentas do Nest para criar um modulo de teste, sem precisar subir a aplicação inteira
	- `import { UserService } from './user.service';
		- importa o serviço que será testado
	- `describe('UserService', () => {}`
		- inicia um bloco de testes agrupado sob o nome "UserService", como uma categoria
	- `let service: UserService;`
		- declara a variável que vai guardar a instancia de `UserService` que vai ser testada
	- `beforeEach(async () => {`
		- Bloco que vai rodar antes e cada teste (`it`)
	- ```const module: TestingModule = await Test.createTestingModule({
	      providers: [UserService],
	    }).compile();```
		- Cria um módulo de testes do NestJS, incluindo apenas o `UserService` como provider. Isso simula o sistema de injeção de dependência do Nest
	- `service = module.get<UserService>(UserService);`
		- Recupera a instância do `UserService` que acabou de ser criada pelo módulo de teste. A partir daqui, eu posso chamar os métodos do service normalmente
	- ```it('should be defined', () => {
	    expect(service).toBeDefined();
	  });```
		- Esse é o básico da sanidade, so para ver se o service foi criado corretamente, para garantir que o setup funcionou
- Eu posso começar a escrever os testes a partir dessa estrutura, mas eu vou ter que mockar as dependências do meu serviço `UserService`
- No caso dele a única dependência é o `constructor(private readonly prisma: PrismaService)` 
- Essa dependência é injetada diretamente no meu código do serviço, para usar ela nos testes eu vou ter que simular como se ela estivesse injetada lá também, para isso eu vou criar meio que uma variação do `PrismaService` que contem apenas as funções que vou usar e com os dados mockados.
- Resumindo o fluxo vai ser o seguinte:
	- `import { PrismaService } from 'src/prisma/prisma.service';`
		- Importar o `PrismaService` no código
	- `let prisma: Partial<PrismaService>;`
		- Criar a variável que vai guardar uma instancia parcial do `PrismaService`
		- O `Partial` serve para tornas todos os métodos do `PrismaService` opcionais
	- `beforeEach(async () => {}`
		- Configurar tudo que vai ocorrer antes de cada teste, que será:
		- `prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };`
			- Isso vai criar as declarar as funções `findUnique` e `create` que são opcionais nessa instancia no `PrismaService`, porem ao invés das funções normais ela vao ter um `jest.fn()` que é uma função vazia do `Jest` que eu vou usar para controlar oque ele retorna, saber se ela foi chamada e com quais argumentos
		- `const module: TestingModule = await Test.createTestingModule({})`
			- Código com toda a declaração do módulo e tals que eu já expliquei antes, porem agora ele vai ter:
				- `{ provide: PrismaService, useValue: prisma }`
				- Que serve para usar o valor "prisma" sempre que algum pedir por "`PrismaService`"
- Pronto, agora que já ta arrumadinho eu só preciso fazer os testes, e antes de cada testes eu vou definir oque eu quero que tal serviço do prisma retorne, por exemplo:
	- Para criar um teste para ver se o cadastro rejeita emails que já existem:
	- `it('deve lançar ConflictException se o e-mail já existir', async () => {})`
		- Declaro a função de teste com o titulo e a função de teste
	- `(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });`
		- Isso significa: "Quando eu chamar `findUnique()` eu quero que retorne `{ id: 1 }`"
	- `await expect()`
		- Função que vou chamar no meu serviço, que é a função que eu quero testar, a função que com certeza vai chamar o `findUnique()` que eu personalizei agorinha
		- `service.cadUser({ email: 'teste@a.com', senha: '123', nome: 'Jean' })`
			- Função sendo chamada dentro do expect
	- `.rejects.toThrow(ConflictException);`
		- Chamando o método de `expect()` direto nele mesmo, especificando que eu espero que a função tenha uma rejeição e que lance `ConflictException()`
- Eu também posso fazer outras coisas como por exemplo, na criação do hash no cadastro, se eu quiser que na verdade a função de criar hash só retorne outra coisa, ao invés de executar seu conteúdo de fato, eu posso usar um `spy`, assim:
	- `jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashFalso');`
		- Isso cria um spy para o método "`bcrypt.hash()`" que faz com que toda vez que ele for chamado ele na verdade retorne apenas "hashFalso"
- Aqui está as verificações que dá pra fazer com o `expect()`
	- `toBe(valor)` - Valor exatamente igual
	- `toBeDefine()` - Ser definido
	- `toEqual(value)` - Valor igual (deep) — objetos, arrays
	- `toBeTruthy()` / `toBeFalsy()` - Se o valor é "truthy" ou "falsy"
	- `toContain(item)` - Se um array ou string contém algo
	- `toHaveLength(n)` - Verifica o tamanho de array ou string
	- `toBeInstanceOf(classe)` - Verifica o tipo de objeto
	- `toMatch(/regex/)` -Verifica correspondência com regex
	- `toHaveBeenCalledTimes(n)` - Quantas vezes o mock foi chamado
	- `toHaveBeenCalledWith(valor)` - Verifica os parâmetros que a função foi chamada
	- `toHaveReturnedWith(valor)` - Verifica o que a função retornou
- Quando voce está esperando uma promise no `expect()`, voce pode usar os seguintes métodos:
	- `rejects`
		- `.rejects.toThrow()` - Se a função lançou uma exceção
		- .`rejects.toBeInstanceOf(ErrorClass)` - Se lançou uma instância específica
		- `.rejects.toEqual(valor)` - Se o erro (ou valor rejeitado) é igual a algo
		- `.rejects.toMatch(/regex/)` - Se o erro contém mensagem correspondente
	- `resolves`
		- Voce pode usar qualquer um dos especificados anteriormente nos metodos do `expect`
- Feito isso, eu tive apenas que ajusta o Jest criando um arquivo "`jest.config.ts`" e configurando com um código pronto eu eu usei pra fazer ele reconhecer os diretório, vou me abster de aprender a fazer isso pois não parece importante, enfim, apos configurar eu usei o código `npx jest src/user/user.service.spec.ts` para executar especificamente o meu teste, mas eu poderia simplesmente executar `npm run test`
- Executando, percebe que nem mesmo aqueles probleminha ignoráveis como "tal variável pode ser indefinida" não passam no teste, então em alguns lugares eu tive que colocar tipos genéricos como "any", que foi o caso na linha que tinha "`let prisma: Partial<PrismaService>`" que virou "`let prisma: any`"
- Fazendo eu eu executei e deu tudo certo, ele cria um checklist de cada "it" dizendo se passou ou não, é bem legal
- Agora para fazer o teste e2e com o supertest, eu vou ter que fazer o seguinte:
	- `let app: INestApplication;`
		- Primeiro declarar uma variável chamada `app` com o tipo `INestApplication`, que representa a aplicação NestJS rodando
		- Vou usar `.init()` e `getHttpServer()` para iniciar e enviar requisições HTTP como supertest
	- `const moduleFixture: TestingModule = await Test.createTestingModule()`
		- Iniciar o módulo normalmente como já foi visto
	- `app = moduleFixture.createNestApplication();`
		- Iniciar o app com aquele módulo
	- `prisma = moduleFixture.get<PrismaService>(PrismaService)`;
		- Configurar o prisma
	- `await app.init();`
		- Iniciar a instancia da aplicação nest
	- `afterAll(async () => {await app.close();});`
		- Depois de executar tudo, encerra a aplicação
- Depois de configurar tudo isso é so começar a fazer os testes, por exemplo, um teste que verifique se os usuários estão sendo cadastrados, supondo que "dto" seja um objeto com os campos necessários para fazer o cadastro:
	- `it('/user/cadastro (POST) deve cadastrar novo usuário', async () => {})`
		- O teste
	- `await prisma.user.deleteMany({ where: { email: dto.email } });`
		- Deletar o usuário caso ele já exista, pois o teste pode ja ter sido feito, e esse usuário é apenas de teste
	- Depois disso é so fazer o teste com `npm run test:e2e`

## 💡 O que eu aprendi

✔ Como configurar um ambiente de teste unitário no NestJS usando `Test.createTestingModule` para isolar um serviço e suas dependências. 
✔ A técnica de "mocking" de dependências, como o `PrismaService`, para que os testes unitários não dependam de serviços externos como o banco de dados. 
✔ Como usar as funções do Jest, como `jest.fn()`, para criar funções de mock, e `jest.spyOn()` para espionar e substituir o comportamento de métodos de outras bibliotecas (como o `bcrypt`). 
✔ Como controlar o retorno de funções mockadas com `.mockResolvedValue()` para simular diferentes cenários em testes assíncronos. 
✔ Como escrever asserções com `expect()`, incluindo a verificação de erros esperados em promises com a sintaxe `.rejects.toThrow()`. 
✔ A configuração de um ambiente de teste E2E, que envolve a criação e inicialização de uma instância completa da aplicação Nest (`INestApplication`). 
✔ Como usar a biblioteca `supertest` para fazer requisições HTTP reais à aplicação de teste, simulando o comportamento de um cliente. 
✔ A prática de interagir diretamente com o banco de dados dentro dos testes E2E para garantir um estado limpo antes de cada execução (setup e teardown). 
✔ Como executar os diferentes tipos de testes através dos scripts do `npm` (`npm run test` para unitários e `npm run test:e2e` para End-to-End).

## 💻 Modificações
- Adicionado testes unitários para `user.service`
- Adicionado testes E2E para cadastro de `user.controller`