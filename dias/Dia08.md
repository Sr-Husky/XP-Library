# Dia 08 –  **Setup do Backend + Docker + Prisma**

**Data:** 08/07/2025

## ✏ O que eu estudei/fiz hoje

- Comecei vendo tudo que eu preciso saber sobre a organização da API e o fluxo de como tudo funciona, vou explicar aqui para fixar e pra já ficar como materia de consulta:
	- Primeiramente sobre o "Nest", ele é quem vai gerenciar tudo, assim como o React faz no frontend, o Nest vai receber todas as requisições e vai executar tudo que for preciso para tratar aquela requisição e devolver uma resposta
	- No Nest eu vou fazer uma configuração muito parecida com a que eu fiz ontem no meu frontend, separando arquivos para os tipos, arquivos para os serviços e arquivos para os controllers, a diferença é que no nest eu também vou ter os arquivos de modulo, que são os que indicarão que tal controlador que chama tal serviço fazem parte de tal modulo
	- Esses serviços que eu vou criar no nest serão os serviços que eu vou usar para gerenciar o banco de dados, para isso eu vou usar o prisma, eu vou precisar configurar um arquivo chamado schema.prisma que é onde eu vou criar as entidades, especificando as colunas e tal, é como se fosse os arquivos "type" que eu criei para o frontend, mas dessa vez eu vou definir eles para o prisma criar as entidades no banco de dados prontas para receber os dados. Alem das entidas, também vai ser no schema.prisma que eu vou definir qual é o provedor do serviço de banco de dados, que vai ser o postgresql, e também a URL do meu banco de dados
	- A configuração do banco de dados vai ser a seguinte, eu vou criar um container para o banco de dados usando o docker-compose, eu não vou ter um acesso literal ao banco de dados, ele meio que já vem pronto, eu so preciso de passar os parametros de usuário e senha na criação do banco de dados, e especificar a porta que ele deve escutar, e então eu vou ter um container isolado numa porta prontinho para receber as requisições de post ou get, porem o único que vai conversar com ele é o prisma, pois o prisma vai ser o cara que eu vou chamar usando funções JS como findMany(), nessa função por exemplo ele ira buscar todas colunas de uma entidade especifica, ser for "prisma.user.findMany()" por exemplo, essa função de irá enviar para o container do banco de dados uma requisição do tipo "SELECT * FROM "User"".
	- O fluxo vai ser mais ou menos o seguinte: O componente React faz a requisição, por exemplo "getUser()", isso vai gerar uma requisição do tipo "GET /users", o nest (que gerou um executavel com um miniservidor que escuta a porta 3000 em um codigo que está no arquivo main.ts) vai receber essa requisição e vai definir qual será a parte do codigo que será chamada, no caso vai ser o modulo associado a "/users" que é o "user.module.ts", nesse arquivo esta especificado qual é o "controller" e o "services", então ele vai no controler para ver qual serviço ele deve usar, o controller ira chamar o serviço, o serviço usa o prisma client para fazer uma requisição ao banco de dados que esta em tal porta, pra isso ele vai usar a URL que vai estar num arquivo .env, que vai estar mais ou menos assim: `DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"`, então no prisma.schema voce so vai referenciar essa variável, e vai ser ela que o prisma vai usar para se conectar ao container do banco, e então ele ira enviar a requisição por essa URL, o banco de dados vai responder com os dados (ou não) e com o status da resposta, se foi bem sucedido ou mal sucedido, então o prisma vai retornar essa saida, para o serviço, o serviço retorna para o controler, o controler retorna para o modulo, o modulo retornar para o nest, e o nest retorna para o frontend, que finalmente vai resolver a promisse.
- Agora que eu tenho  a teoria eu vou colocar tudo em ação para ver tudo funcionando, eu dei uma olhada nos meus objetivos diário e eu provavelmente vou acabar fazendo mais coisas do que eu precisaria, pegando talvez alguma partes que eu e o chatgpt programamos pra fazer em outro momento, mas sinceramente eu não vejo problema em adiantar algumas coisas, talvez num ambiente de trabalho seja diferente, mas no meu caso em particular não tem problema nenhum, agora eu vou instalar e iniciar tudo que eu preciso para criar o ambiente:
	- `npm i -g @nestjs/cli`: Comando que vou usar para instalar o CLI no nest, o parâmetro `i` equivale a `install` e o `-g` serve para que o modulo seja instalado de forma que eu possa usar em qualquer lugar e não so no diretório do projeto.
	- Eu estava pensando: "Puts eu deveria usar mais o console do VS Code", acabei de mudar de ideia, esse primeiro comando tava dando um erro esquisito do console do VS Code, no cmd do windows deu tudo certo
	- `nest new backend`: Cria o projeto com os arquivos iniciais em uma pasta "backend"
		- Explicando os arquivos criados:
			- Raiz (`/backend`)
				- `.gitignore`: arquivo pra fazer o git ignorar arquivos ou diretórios, o mais importante é o `node_modules`
				- `.prettierrc`: arquivo de configuração para um tal de "Prettier" que é uma ferramenta que formata o meu código automaticamente pra deixar ele num estilo mais consistente
				- `package.json`: O de sempre, arquivo com as dependências do projeto
				- `package-lock.json`: Um arquivo que contem a versão de cada dependência instalada, para garantir que o projeto funcione da mesma forma em qualquer máquina
				- `tsconfig.build.json`: Configurações do typescript para usar a compilação final do projeto (produção)
				- `tsconfig.json`: Arquivo principal de configuração do typescript, ele define como meus arquivos .ts devem ser analisados e compilados pra JS
			- Pasta `/src`
				- `main.ts`: O ponto de entrada da aplicação, como eu já disse antes. Ele é o primeiro a ser executado e é oque vai colocar o nest para ouvir a porta 3000
				- `app.module.ts`: O modulo raiz, ele via ser o organizador principal conectando os controllers e os services
				- `app.controller.ts`: O controlador. Ele recebe as requisições HTTP e decide oque fazer com elas. Ele define as rotas (URLs) da sua API. Por padrão ele tem uma rota básica.
				- `app.service.ts`: O serviço. Ele contém a lógica de negócio da aplicação. O controller chama os métodos do service para realizar tarefas de fato (ex: buscar algo no banco de dados)
				- `app.controler.spec.ts`: Um arquivo de teste unitário para o `app.controler.ts`, ele serve para ver se o controlador esta se comportando como esperado
			- Pasta `/test`
				- `app.e2e-spec.ts`: Um arquivo de teste "End-to-End" (E2E). Ele testa um fluxo completo da aplicação, fazendo requisição HTTP real para sua API e verificando se a resposta está correta
				- `jest-e2e.json`: O arquivo de configuração para o "Jest" (framework de teste), usando especificamente para rodar os teste E2E
		- Esse comando cria o diretório "backend" com todos os arquivos citados acima, ele "prepara o terreno" pra eu começar a implementar minha funções
	- `npm install prisma --save-dev`: comando para instalar o prisma
		- Esse comando é executado na pasta do meu backend, e ele irá instalar o prisma que eu vou usar para fazer os migrates que vão criar as entidades no banco de dados
		- O parâmetro `--save-dev`  serve para que ele seja instalado como uma dependência de desenvolvimento, e não de produção
	- `npm install @prisma/client`: É o Prisma Client que eu vou precisar também na produção para fazer as requisições para o banco de dados
	- `npx prisma init`: Comando para iniciar o prima, assim como eu fiz com o nest que criou a pasta `backend` eu tambem fiz com o prisma que já criou a sua pastinha `/prisma` com o `schema.prisma`
	- Configurar o .env com a URL do data base. O prisma já criou o arquivo .env e colocou uma URL de database lá, eu só apaguei e coloquei a URL `DATABASE_URL="postgresql://user:password@localhost:5432/xp-library"` eu entendo que em uma situação real eu nunca poderia compartilhar essa URL com o usuário e a senha do meu banco de dados
	- Agora eu configurar o `schema.prisma` com os meus dados, vou colocar minha URL e colocar os modelos para as entidades
		- Percebi que agora que vem a parte que eu disse que ia remover o campo senha, mas pesquisando mais a fundo vi que não tem necessidade disso, eu posso simplesmente usar algum método para não retornar essa senha para o meu front, porem mesmo não retornando a senha, eu não deveria guardar a senha de fato e sim um hash da senha gerado pelo bcrypt, e comparar o hash da senha do banco de dados com o hash da senha que foi digitada, para saber se é a mesma senha ou não. Mas eu não vou implementar esse tipo de coisa por ser um projeto de teste, e que eu não quero muita complexidade, mas entendo que em um projeto real isso seria crucial
		- Agora eu estou modelando as minhas entidades, e estou percebendo que talvez eu precise muda-las futuramente
		- Fiquei horas pesquisando sobre como tudo funciona no prisma com banco de dados, é o seguinte:
			- Para definir uma tabela voce faz assim `model Tabela { <colunas> }`
			- Voce deve especificar um tipo para cada coluna, pode ser Int, String, DateTime, Boolean, etc, e também pode ser vetor, para isso voce so coloca o tipo e na frente um abre e fecha colchetes, ex:`Int[]`
			- Para criar relações voce deve adicionar duas linhas no modelo da tabela, uma linha para especificar o nome da coluna e o tipo dela, ex:`id_user Int`, e depois outra linha para relaciona-la com a coluna da outra tabela, voce ira colocar outro nome de coluna e o tipo será o nome da tabela que voce esta relacionando, aqui vai um exemplo completo:
			- `model User {`
			- `    id Int @id`
			- `}`
			- `model XP {`
			- `    id Int @id`
			- `    id_user Int`
			- `    user User @relation(fields: [id_user], references: [id])`
			- `}`
			- No exemplo acima eu crio uma tabela "User" que só recebe um "id", e crio uma tabela XP que tem seu próprio "id" e também uma chave estrangeira que é o `id_user`, para isso eu crio a tabela id_user normalmente, e em baixo dela eu coloco a linha que faz o relacionamento, ela diz que o campo "id_user", referencia "id", mas é o "id" da onde? é o "id" de "User" que foi especificado como se fosse o "tipo"
			- Voce também pode criar relação bidirecionais, onde voce pode acessar XP através de User, e pode acessar User através de XP, para isso voce so precisa especificar na outra tabela também, no exemplo acima voce apenas adicionaria a linha: `xp XP[]`, que quer dizer que "xp" tem o tipo "vetor de tabela XP", mas isso não criaria uma coluna nova, diferente dos outros, como o tipo dela é uma tabela, ela só seria como um atalho, ou seja, não tem coluna nova, mas se voce fizer uma requisição e no corpo da requisição voce especificar que quer os dados dessa relação, ele ira te retornar os dados da tabela que voce pediu e também os dados dessa outra tabela da relação, em forma de vetor de objetos, resumindo, no objeto retornado o valor existe, mas no banco de dados ele é só um atalho.
			- Quando voce precisa de relacionar mais de uma tabela voce deve nomear cada relacionamento para o prisma conseguir gerenciar tudo bonitinho, que ficaria assim:
			- `model User {`
			- `    id Int @id`
			- `    xp XP[] @relation("Experiencias")`
			- `}`
			- `model XP {`
			- `    id Int @id`
			- `    id_user Int`
			- `    user User @relation("Experiencias", fields:[id_user], references: [id])`
			- `}`
		- Voce também pode usar os atributos (começam com @, que se aplicação a um campo especifico, ou @@, que se aplicam ao modelo inteiro) e as funções do prisma:
			- Atributos:
				- `@id` - Marca o campo como a chave primária (`PRIMARY KEY`) da tabela. Cada modelo precisa ter exatamente um `@id` (ou um `@@id`)
				- `@unique` - Garante que todos os valores nesta coluna sejam únicos em toda a tabela (cria uma `UNIQUE constraint`).
				- `@default(...)`- Define um valor padrão para o campo quando um novo registro é criado.
				- `@updatedAt` - Atualiza automaticamente o campo com o timestamp do momento em que o registro foi modificado.
				- `@relation(...)` - Define uma relação entre dois modelos.
					- Argumentos principais:
					    - `name`: Um nome único para a relação (obrigatório se for ambígua).
					    - `fields`: A coluna neste modelo que guarda a chave estrangeira.
					    - `references`: A coluna no outro modelo que a chave estrangeira se refere.
				- `@map(...)` - Mapeia o nome de um campo no Prisma para um nome de coluna diferente no banco de dados. Útil para trabalhar com bancos de dados legados.
					- Exemplo: `primeiro_nome String @map("first_name")`
				- `@db.(...)` - Especifica um tipo de dado nativo do banco de dados que não existe no Prisma.
					- Exemplo: `titulo String @db.VarChar(255)`
				- `@ignore` - Informa ao Prisma Client para ignorar este campo. O campo existe no banco de dados, mas não existirá nos tipos gerados para o seu código.
					- Exemplo: `senha String @ignore`
				- `@@id([...])` - Cria uma chave primária composta, usando múltiplos campos.
					- Exemplo: `@@id([userId, xpId])`
				- `@@unique([...])` - Cria uma restrição de unicidade composta. Garante que a _combinação_ de valores nos campos seja única.
					- Exemplo: `@@unique([titulo, autorId])`
				- `@@index([...])` - Cria um índice no banco de dados em um ou mais campos para acelerar consultas de leitura.
					- Exemplo: `@@index([email])`
				- - `@@map(...)` - Mapeia o nome do modelo no Prisma para um nome de tabela diferente no banco de dados.
			        - Exemplo: `model Usuario { ... } @@map("users")`
				- `@@ignore` - Faz com que o Prisma Client ignore o modelo inteiro. Útil para tabelas que você não quer que sua aplicação acesse diretamente.
					- Exemplo: `model LogsAntigos { ... } @@ignore`
			- Funções (Usadas dentro de `@default`)
				- `autoincrement()` - Configura um número inteiro para se auto-incrementar a cada novo registro. Usado em chaves primárias.
				    - Exemplo: `id Int @id @default(autoincrement())`
				- `now()` - Define o valor padrão como o timestamp do momento da criação do registro.
				    - Exemplo: `data DateTime @default(now())`
				- `uuid()` - Gera um Identificador Único Universal (UUID) como valor padrão.
				    - Exemplo: `id String @id @default(uuid())`
				- `cuid()` - Gera um ID Único Resistente a Colisões (CUID). É mais curto que um UUID e ótimo para usar em URLs.
				    - Exemplo: `id String @id @default(cuid())`
				- `dbgenerated(...)` - É uma "saída de emergência". Informa ao Prisma que o valor padrão é gerado pelo próprio banco de dados, através de uma função ou mecanismo que o Prisma não controla.
				    - Exemplo: `id Int @default(dbgenerated("minha_funcao_sql()"))`
	- Agora com o `schema.prisma` configurado eu vou fazer a migração dos dados para o banco de dados e criar as tabelas
		- Primeiro eu preciso de configurar o docker-compose para subir um container com a imagem oficial do postgresql e com as variaveis de ambiente especificando meu login e senha, e depois especificando a porta para que o prisma possa se conectar
	- `npx prisma migrate dev --name "migrate-inicial"`
	- Esse comando serve para construir o banco de dados baseado no schema, eu fiz aqui e deu tudo certo graças a Deus, eu deixei so o container do banco de dados no docker-compose.yml porque não parece ser bom eu ficar subindo container do front, do back e do postgres agora, pois seria eu prefiro subir o meu front e o meu back manualmente por enquanto, depois eu coloco tudo pra rodar no docker
	- Eu já conferi tudo no prisma studio, mas mesmo assim por questões de profissionalismo eu vou criar também um container para o pgadmin para que eu possa visualizar o banco de dados
	- Pronto, agora o docker-compose sobre 2 containers, postgres e pgadmin
- Com isso eu finalizo os preparativos do ambiente para começar a codar

## 💡 O que eu aprendi

✔ O fluxo completo de uma requisição, desde o front-end (React) até o back-end (NestJS), que  utiliza o Prisma para se comunicar com um banco de dados (PostgreSQL) rodando em um container Docker. 
✔ A arquitetura de uma aplicação NestJS, compreendendo a função e a interconexão de Módulos, Controladores e Serviços. 
✔ Como iniciar um novo projeto com o NestJS CLI (`nest new`) e a finalidade da estrutura de arquivos gerada, como `main.ts`, `app.module.ts` e `app.controller.ts`. 
✔ Como instalar, inicializar (`npx prisma init`) e configurar o Prisma em um projeto back-end para atuar como ORM (Object-Relational Mapping). 
✔ A sintaxe detalhada para modelar entidades no arquivo `schema.prisma`, incluindo a definição de colunas, tipos de dados e o uso de funções como `autoincrement()` e `now()` para valores padrão. 
✔ Como criar relacionamentos (chaves estrangeiras) entre tabelas/modelos, tanto unidirecionais quanto bidirecionais, usando a sintaxe de `@relation` no Prisma. 
✔ A função dos principais atributos do Prisma, como `@id`, `@unique`, `@default`, `@map` e `@@unique`, para definir chaves primárias, restrições e mapeamentos no banco de dados. 
✔ Como utilizar o Docker Compose para orquestrar e executar múltiplos serviços em containers, especificamente um banco de dados PostgreSQL e uma ferramenta de gerenciamento como o pgAdmin. 
✔ O processo de aplicar as definições do `schema.prisma` ao banco de dados para criar as tabelas e a estrutura com o comando `npx prisma migrate dev`. 
✔ A importância de usar arquivos `.env` para gerenciar informações sensíveis e variáveis de ambiente, como a URL de conexão do banco de dados, mantendo-as fora do controle de versão.

## 💻 Modificações

- Instalado NestJS na pasta "backend"
- Instalado prisma
- Configurado modelos prisma para o banco de dados
- Configuradas variáveis de ambiente necessárias
- `docker-compose.yml` programado para criar containers para `postgres` e `pgadmin`

