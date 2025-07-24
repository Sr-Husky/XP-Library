# Dia 23 – **Configuração do Nginx como Reverse Proxy**

**Data:** 23/07/2025

## ✏ O que eu estudei hoje

- Bom... como tudo que eu tinha pra fazer hoje eu já fiz ontem, hoje eu já vou adiantar alguns tópicos do dia 24
- Assim como eu sempre fiz, eu vou deixar esse título só por questões de organização, mas a verdade é que o assunto dessa anotação é outro, que no caso será **Automação de Testes (GitHub Actions)**
- O GitHub Action é uma plataforma CI/CD (Integração Contínua/Deploy Contínuo), para automatizar tarefas no repositório, ele pode:
	- Rodar testes automatizados
	- Fazer deploys
	- Rodar scripts de lint
	- Gerar builds
	- Atualizar documentação, etc.
- Ele funciona com arquivos YAML dentro da pasta `.github/workflows/`, o GitHub oferece toda a infraestrutura (máquinas virtuais - _runners_)
- Além de testes, na pasta `workflows` voce pode colocar qualquer outro tipo de automação como:
	- Deploy contínuo (CD)
	- Atualização de dependências
	- Publicação de pacotes NPM
	- Verificação de segurança
	- Criação automática de releases
	- Envio de notificações (ex: Slack, Discord)
	- Integração com ferramentas externas (Docker, AWS, etc.)
- Um workflow de teste, que vai ser o meu caso, tem a seguinte estrutura:
	- ``` name: Testes Automatizados
		on:
		  push:
		  pull_request:
		  
		jobs:
		  run-tests:
			runs-on: ubuntu-latest
		
			steps:
			  - name: Checkout do código
				uses: actions/checkout@v3
		
			  - name: Instalar dependências do Frontend
				working-directory: ./frontend
				run: npm install
		
			  - name: Rodar testes do Frontend
				working-directory: ./frontend
				run: npm test
		
			  - name: Instalar dependências do Backend
				working-directory: ./backend
				run: npm install
		
			  - name: Rodar testes do Backend
				working-directory: ./backend
				run: npm test```
- Aqui vai uma explicação de oque são esses campos que eu usei, e outros que eu posso usar:
	- `name:` Nome do workflow (visível na aba “Actions”)
	- `on:` Eventos que disparam o workflow
		- `push:` Dispara o workflow quando há um `git push`
		- `pull_request:` Dispara quando um PR é aberto, atualizado ou sincronizado. 
			- As linhas abaixo valem para `push` e `pull_request`
			- `branches: [main]` Limita a quais branches o push se aplica
			- `tags: ['v*']` Limita a quais tags o push se aplica
			- `paths: ['src/**']` Executa o workflow apenas se arquivos específicos forem alterados
			- `paths-ignore: ['src/**']` Ignora determinados caminhos

		- `workflow_dispatch:` Permite rodar o workflow manualmente com um botão no GitHub.
			- `inputs:` Usa `inputs` para campos personalizados.
				- `environment:`
					- `description:` 'Ambiente de destino'
					- `required:` true
					- `default:` 'staging'

		- `schedule:` Executa periodicamente (cron).
			- `- cron: '0 0 * * *'`  Diariamente à meia-noite UTC

		- `release:` Ao criar/publicar um release
		- `issues:` Quando uma issue é aberta/editada/fechada
		- `fork:` Quando alguém faz fork
		- `delete:` Quando uma branch ou tag é deletada
		- `create:` Quando uma branch ou tag é criada
		- `watch:` Quando alguém dá star
		- `deployment:` Quando um deploy é iniciado
		- `pull_request review:` Quando alguém revisa um PR

	- `env:` Define variáveis de ambiente **globais** para todos os jobs.
		- `NODE_ENV: test`
		- `API_KEY: ${{ secrets.API_KEY }}`

	- `defaults:` Define configurações padrão como shell ou diretório
		- `run:`
			- `shell: bash`
			- `working-directory: ./backend`

	- `concurrency:` Evita que múltiplos workflows rodem simultaneamente.
		- `group: ci-group`
		- `cancel-in-progress: true`

	- `permissions:` Define as permissões que o workflow terá (segurança).
		- `contents: read`
		- `issues: write`
	- `jobs:` Onde você define os jobs (tarefas paralelas ou em sequência)
		- `<nome do job>`
			- `name:` Nome legível do job
			- `runs-on:` Ambiente onde o job será executado (ex: ubuntu-latest)
			- `env:` Variáveis de ambiente específicas do job
			- `needs:` Define que este job depende de outro
			- `timeout-minutes:` Tempo máximo do job
			- `if:` Condição para execução
			- `continue-on-error:` Ignora falhas
			- `defaults:` Mesmo formato do global
			- `permissions:` Permissões específicas do job
			- `strategy:` Usado para matriz de execução
			- `container:` Rodar o job dentro de um container
			- `services:` Containers auxiliares (ex: banco de dados para testes)
			- `outputs:` Usado para passar valores para outros jobs
			- `runs-on`: Define o ambiente de execução:
				- `ubuntu-latest`
				- `windows-latest`
				- `macos-latest`
			- `steps:` Cada etapa dentro do job:
				- `- name:` Nome legível da etapa
				- `run:` Comando a ser executado (bash, powershell, etc)
				- `uses:` Ação de terceiros (ex: actions/checkout@v3)
				- `with:` Argumentos para ações
				- `env:` Variáveis de ambiente
				- `working-directory:` Diretório de trabalho
				- `if:` Condição para executar o step
				- `shell:` Shell específico (bash, pwsh, etc)
				- `id:` Identificador para capturar outputs
				- `continue-on-error:` Não para o job se este step falhar
			- `strategy.matrix:` Executa o mesmo job com combinações diferentes de variáveis:
				- `strategy:`
					- `matrix:`
					- `node-version: [14, 16, 18]`
				- `steps:`
					- `- uses: actions/setup-node@v3`
					- `with:`
						- `node-version: ${{ matrix.node-version }}`
			- `container:` e `services:` Usa containers para isolar jobs ou rodar serviços auxiliares:
				- `container:`
					- `image: node:18`
				- `services:`
					- `postgres:`
						- `image: postgres:13`
						- `env:`
							- `POSTGRES_PASSWORD: exemplo`
						- `ports:`
							- `- 5432:5432`
- E vai ser exatamente esses comandos que vou usar amanhã para escrever automatizar os teste da minha aplicação
## 💡 O que eu aprendi

✔ O que é o GitHub Actions e sua função como uma plataforma de CI/CD para automatizar tarefas como testes e deploys diretamente no repositório. 
✔ Como os workflows são definidos em arquivos YAML dentro da pasta `.github/workflows/` do projeto. 
✔ A estrutura fundamental de um arquivo de workflow, incluindo os campos `name` (nome), `on` (gatilhos como `push` e `pull_request`) e `jobs` (tarefas a serem executadas). 
✔ A anatomia de um `job`, que define o ambiente de execução (`runs-on`) e uma sequência de `steps` (passos) a serem seguidos. 
✔ Os comandos essenciais de um `step`, como `uses` para usar ações prontas (ex: `actions/checkout`), `run` para executar comandos de terminal, e `working-directory` para especificar pastas. 
✔ Como criar workflows com múltiplas etapas, como instalar dependências e rodar testes separadamente para o frontend e o backend dentro do mesmo `job`. 
✔ O conceito de gatilhos mais avançados (`schedule` para agendamento, `workflow_dispatch` para execução manual) e a configuração de matrizes (`strategy.matrix`) para executar testes em diferentes ambientes. 
✔ A possibilidade de usar `services` para iniciar containers auxiliares, como um banco de dados, para a execução de testes de integração dentro do workflow.