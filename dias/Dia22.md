# Dia 22 –  **Preparação para Produção e Docker Compose Final**

**Data:** 22/07/2025

## ✏ O que eu estudei/fiz hoje

- Hoje é o dia que eu finalmente vou colocar todo o projeto pra rodar usando o docker compose, e assim eu vou precisar usar apenas um comando para subir os containers e ter tudo funcionando.
- Pelo oque eu pesquisei até agora, o panorama das modificações será o seguinte: vou criar uma pasta para o "nginx" (não quero ele junto com o front, quero ele separado para servir ao backend também), vou criar um `dockerfile` para o front e um pro back que é onde eu vou fazer o build de tudo para a versão de produção, esse no caso vai ser o "`Dockerfile multi-stage`" onde ele cria uma imagem só pra fazer o build do meu projeto e depois cria outra imagem limpa onde ele só vai colocar o necessário e executar o projeto
- Primeiro vou escrever o dockerfile do backend:
	- Primeira etapa: criar o build
		- `FROM node:20-alpine AS builder`
			- Usa a imagem oficial do Node.js v20 baseada em Alpine Linux (leve)
			- `AS builder`: nomeia essa etapa como `builder`, pra usarmos depois
		- `WORKDIR /app`
			- Cria (se necessário) e entra no diretório `/app` dentro do container.
		- `COPY package*.json ./`
			- Copia `package.json` e `package-lock.json` (se existir) do meu computador para a pasta atual do container (`/app`).
			- Isso é feito antes do resto dos arquivos, para que o `npm install` seja cacheável (melhora o tempo de build).
		- `RUN npm install`
			- Instala as dependências baseando-se no arquivo `package.json`
		- `COPY . .`
			- Copia todo o projeto para o diretório do container
		- `RUN npm run build`
			- Faz o build e coloca na pasta "`/dist`"
	- Segunda etapa: produção
		- `FROM node:20-alpine`
			- Começa uma nova imagem, limpa
		- `WORKDIR /app`
			- Define o diretório que vai ficar os negócio
		- `COPY --from=builder /app/package*.json ./`
			- Copia os arquivo `package.json` e `package-lock.json` do container "builder" que nos acabamos de passar para o nosso container atual
		- `COPY --from=builder /app/node_modules ./node_modules`
			- Agora faz o mesmo para os módulos (pra não precisar instalar de novo)
		- `COPY --from builder /app/dist ./dist`
			- Agora copia o projeto todo (já transpilado) para o container
		- `EXPOSE 3000`
			- Mapeia o container para ouvir a porta 3000
			- Isso não abre a porta por si só, apenas documenta
		- `CMD ["node", "dist/main.js"]`
			- Esse é o comando que vai ser executado quando o container iniciar
- Agora vamos para o docker file do frontend
	- A primeira etapa é feita exatamente igual o backend
	- Segunda etapa: produção
		- `FROM alpine:3.19 AS production`
			- Como o frontend vai ser apenas um `/dist` estático, eu não vou precisar do node pra nada, então vou usar essa imagem que é bem mais simples e leve
		- `WORKDIR /app`
			- Define o diretório que vai ficar o `dist`
		- `COPY --from:builder /app/dist ./dist`
			- Copia os arquivos do front do container builder
	- Na segunda etapa nos não precisamos copiar `node_modules` ou `package.json` porque o front é estático e não vai precisar deles na versão de produção
- Feito isso eu tive que ajustar o `docker-compose.yml` para buildar o back e o front do meu projeto, no caso do front eu tive que configurar as variáveis de ambiente por argumentos, pois o vite não alcançava naquele escopo do docker, e eu também tive que fazer a parte do nginx mesmo sabendo que era pra amanhã, pois eu queria testar minha aplicação
- No nginx eu só tive que colocar um código bem engessado que não tem muito oque aprender:
	- Tudo e feito dentro de `server{}` que é onde eu especifico a posta que o nginx irá escutar e as rotas
		- `listen 80;`
			- diz para o nginx escutar a porta padrão 80
		- `location / {}`
			- permite definir um comportamento para aquela rota
				- `root /usr/share/nginx/html;`
					- Define um caminho
				- `index index.html;`
					- Define o arquivo que será servido
				- `try_files $uri $uri/ /index.html;`
					- Tenta o achar o arquivo, o diretório e caso não encontre um correspondente para aquela rota ele deixa que a aplicação cuide da rota, isso é essencial para SPA (Single Page Application)
		- `location /api/ {}`
			- Define um comportamento para a rota "/api"
				- `proxy_pass http://backend:3000/;`
					- Faz o papel de proxy reverso
					- O nome "backend" é o nome do container e ele é resolvido automaticamente
				- `proxy_http_version 1.1;`
					- Versão mais recomendada
				- `proxy_set_header Host $host;`
					- Passa o header do host para frente
				- `proxy_set_header X-Real-IP $remote_addr;`
					- Adiciona o endereço ip
- Essa configuração descrita é posta no arquivo `default.conf` e é referenciado no docker-compose para ser usado como volume do container, além disso o volume usado pelo container do front também deve ser compartilhado com o nginx pois ele vai servir o build que o front gera (o front so vai servir pra isso, o container so abre, gera o build, e fecha)
- Feito isso, para gerar o build mesmo eu tive que arrumar varios probleminhas de "possible undefined", "possible null", etc, pois na build isso não pode passar. Apos arrumar isso eu também tive que ajustar o `schema.prisma` para funcionar em linux, pois no docker eu estou usando imagens baseadas em linux, eu fiz isso adicionando a linha `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` no campo `generator client{}`, e depois usei o `npx prisma generate`.
- Depois eu já estava conseguindo usar a minha aplicação normalmente toda em containers no docker, eu só fiz mas alguns ajustes tirando todos os `console.log()` e fiz uma alteração (depois de horas procurando o erro) numa invalidação de cache que estava errada, e estava fazendo os modal não atualizar o ícone de publico/privado automaticamente

## 💡 O que eu aprendi

✔ Como criar um `Dockerfile` multi-stage para otimizar imagens de produção, separando a etapa de `build` da etapa de execução final. 
✔ A sintaxe e o propósito de comandos essenciais do Dockerfile como `FROM ... AS`, `WORKDIR`, `COPY --from`, `RUN` e `CMD`. 
✔ A lógica de otimização de imagem, copiando apenas os artefatos necessários (como a pasta `/dist` e `node_modules`) para a imagem final, resultando em um container menor e mais seguro. 
✔ Como configurar o Nginx para atuar como um servidor de arquivos estáticos para o frontend e como um reverse proxy para o backend. 
✔ O uso da diretiva `proxy_pass` no Nginx para redirecionar requisições de uma rota específica (ex: `/api`) para o container do backend. 
✔ A importância da diretiva `try_files` no Nginx para garantir o funcionamento correto do roteamento em uma Single Page Application (SPA). 
✔ Como orquestrar a aplicação completa com o Docker Compose, utilizando volumes para compartilhar o build do frontend com o container do Nginx. 
✔ Como resolver problemas de compatibilidade para produção, como configurar o `binaryTarget` do Prisma para funcionar em um ambiente Linux e corrigir erros de tipagem do TypeScript que são barrados durante o processo de `build`.

## 💻 Modificações

- Criado pasta e arquivo de configurações para `Nginx`
- Arquivo do Docker Composer ajustado para subir toda a aplicação em containers
- Resolvido probleminhas de tipagem do Typescript que foram ignorados no desenvolvimento
- Criado `Dockerfile` para especificar como o container do front e do back devem ser construídos