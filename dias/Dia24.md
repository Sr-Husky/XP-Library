# Dia 24 – CI/CD Parte 1: Automação de Testes (GitHub Actions)

**Data:** 24/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje eu implementei de fato o testes para o GitHub Actions, criei a pasta do workflows e o arquivo `test.yml`, que é um arquivo que automatiza aqueles dois testes que fiz anteriormente, o teste unitário e o teste e2e.
- Aqui vai a explicação de cada parte do codigo:
	- Primeiramente eu defino um nome para o workflow:
		- `name: Testes Automatizados`
	- Agora eu coloco os triggers que ativam esse workflow:
		- `push:`
		- `pull_request:`
		- `workflow_dispatch:`
	- Também coloquei o `workflow_dispatch` para que possa testar o workflow por um botão no GitHub, e não apenas pelos triggers
	- Agora eu defino o "job" que vai ser só um, e terá o nome "test"
		- `jobs:`
			- `test:`
			- Aqui dentro do job eu vou configurar primeiro o ambiente de execução
				- `runs-on: ubuntu-latest`
			- Eu também vou precisar criar um serviço, que é tipo um container (ou literalmente um container) que vai hospedar um serviço especifico, que no meu caso vai ser o banco de dados, pois o meu teste e2e precisa do banco de dados para funcionar
				- `services:`
					- `postgres:`
						- `image: postgres:14`
						- `env:`
							- `POSTGRES_DB: xp-library`
							- `POSTGRES_USER: user`
							- `POSTGRES_PASSWORD: password`
						- `ports:`
							- `- 5432:5432`
						- `options: >-`
							- `--health-cmd pg_isready`
							- `--health-interval 10s`
							- `--health-timeout 5s`
							- `--health-retries 5`
			- Esse código é só para configurar o serviço com usuário, senha, porta, e verificação "health"
			- Depois disso eu precisei definir as variáveis de ambiente:
				- `env:`
					- `DATABASE_URL: postgresql://user:password@localhost:5432/xp-library`
					- `JWT_SECRET: ${{ secrets.JWT_SECRET }}`
			- No caso do `JWT_SECRET` eu coloquei a variável diretamente no GitHub, pois não queria expor no meu `YAML`, no próprio GitHub tem como setar as variáveis de ambiente, e eu posso referenciar elas no meu código assim como fiz acima
			- Agora vem a parte da ação em si, os `steps`:
				- `steps:`
					- `- name: Checkout do código`
					    `uses: actions/checkout@v3`
					- `- name: Instalar dependências do Backend`
					    `working-directory: projeto/backend`
				        `run: npm install`
					- `- name: Rodar testes unitários`
					    `working-directory: projeto/backend`
					    `run: npm run test`
					- `- name: Rodar migrations do Prisma`
					    `working-directory: projeto/backend`
					    `run: npx prisma migrate deploy`
					- `- name: Rodar testes E2E`
					    `working-directory: projeto/backend`
					    `run: npm run test:e2e`
			- Os passos são: Fazer checkout -> Instalar dependências -> Rodar testes unitário -> Fazer o migrate do prisma -> Rodar teste e2e
	- Aqui finaliza bloco "job" e o arquivo yml
- Eu fiz e testei tudo num repositório novo criei, apenas copiei os arquivos para outra pasta, enviei para um novo repositório e fui fazendo os push modificando o yml para fazer os testes, agora que tenho a versão final vou fazer o push no repositório original, só tenho que terminar de escrever esse arquivo antes, espero que não dê nada de errado (e nem tem motivo pra isso, eu testei tudinho), enfim, se der algo de errado eu vou arrumar só no próximo commit que vou fazer amanhã (quero manter a regra de 1 commit por dia)

## 💡 O que eu aprendi

✔ Como criar um arquivo de workflow (`.yml`) na pasta `.github/workflows/` para automatizar tarefas. 
✔ Como usar a seção `services` para iniciar um container de banco de dados (PostgreSQL) para ser usado durante os testes E2E. 
✔ A importância de adicionar opções de `health check` ao serviço de banco de dados para garantir que ele esteja pronto antes que os testes comecem. 
✔ Como gerenciar variáveis de ambiente (`env`) no workflow, incluindo o uso de `secrets` do GitHub para armazenar dados sensíveis como o `JWT_SECRET`. 
✔ A sequência de `steps` necessária para um pipeline de testes de backend: fazer o `checkout` do código, instalar dependências, rodar testes unitários, aplicar migrações do banco e, por fim, rodar os testes E2E. 
✔ A importância de usar o comando `npx prisma migrate deploy` em um ambiente de CI para preparar o banco de dados de forma não interativa.

## 💻 Modificações

* Criado arquivo de teste para GitHub Actions "`.github/workflows/test.yml`"
* Deletado arquivos de teste `.spec` não usados
