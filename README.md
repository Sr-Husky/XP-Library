# **XP Library**

Este projeto foi um desafio pessoal: aproveitar o mês de férias de julho para estudar desenvolvimento web, construindo um sistema Full-Stack completo.

## ⚪ **Proposta do software**

Uma plataforma web para compartilhamento de frases, reflexões e lições de vida. Os usuários podem publicar suas experiências, organizá-las por temas (tags), e interagir socialmente através de curtidas e favoritos.

## 💡 **Motivação**

Percebi que programação web é uma ótima forma de começar minha carreira como programador, pois além de muito necessario no mercado atual, é algo que possibilita uma curva de aprendizado satisfatória, perfeito para mim que preciso gerenciar meu tempo entre faculdade e estudos.

## 🎯 **Objetivo**

Servir como um projeto de estudo intensivo durante o mês de julho, com o objetivo de construir uma aplicação full-stack para aprendizado prático e criação de portfólio.

## ⚙ **Tecnologias Utilizadas**

A pilha de tecnologias (tech stack) d o projeto é a seguinte:

- #### **Front-end**
	- **Framework:** React
	- **Build Tool:** Vite
	- **Estilização:** TailwindCSS
	- **Roteamento:** React Router DOM
	- **Gerenciamento de Estado de Servidor:** TanStack Query (React Query)
	- **Gerenciamento de Estado do Cliente:** Context API do React.

- #### **Back-end**
	- **Framework:** NestJS
	- **ORM (Object-Relational Mapping):** Prisma
	- **Autenticação:** `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt` para implementação de JSON Web Tokens (JWT).

- #### **Banco de Dados**
	- **Sistema Gerenciador:** PostgreSQL
	- **Ferramenta de Administração:** pgAdmin

- #### **Infraestrutura, DevOps e Automação**
	- **Containerização:** Docker e Docker Compose.
	- **Build de Produção:** Uso de **Multi-stage Dockerfiles** para criar imagens otimizadas e menores
	- **Web Server / Reverse Proxy:** Nginx
	- **CI/CD (Integração e Entrega Contínua):** GitHub Actions para automação de testes e deploy.

- #### **Testes**
	- **Testes de Back-end:** Testes unitários para `services` e testes de integração (E2E) para `controllers` usando Supertest.

## 💠 **Arquitetura e Padrões de Software**

A arquitetura do projeto é moderna e segue práticas comuns de desenvolvimento web, separando claramente as responsabilidades entre o cliente (front-end) e o servidor (back-end).

O sistema é estruturado nas seguintes camadas lógicas:

- **Camada de Apresentação (Front-end):** Uma Single-Page Application (SPA) construída com React. É responsável por toda a interface do usuário, renderização de componentes, gerenciamento de estado do lado do cliente e interações do usuário.

- **Camada de Servidor/Gateway (Reverse Proxy):** O Nginx é utilizado em ambiente de produção para servir os arquivos estáticos da aplicação React e atuar como um Reverse Proxy. Ele direciona as chamadas de API (prefixo `/api/*`) para a aplicação back-end, unificando o acesso sob um único domínio.

- **Camada de Aplicação (Back-end):** Uma API RESTful desenvolvida com NestJS. Esta camada contém toda a lógica de negócio, incluindo manipulação de dados, autenticação e autorização. Ela é organizada de forma modular.

- **Camada de Acesso a Dados (ORM):** O Prisma funciona como a ponte entre a aplicação NestJS e o banco de dados. Ele gerencia as conexões, modela os dados através do `schema.prisma` e oferece uma API segura para realizar operações no banco (CRUD).

- **Camada de Persistência (Banco de Dados):** Um banco de dados relacional PostgreSQL é utilizado para armazenar permanentemente os dados da aplicação, como usuários, experiências, curtidas e favoritos.

## 💻 **Padrões de Projeto e Conceitos Aplicados**

- **REST API:** O back-end expõe seus serviços através de uma API RESTful, um padrão para comunicação cliente-servidor via HTTP.

- **Modularidade:** O back-end em NestJS é explicitamente modular, o que facilita a organização, manutenção e teste do código. A estrutura de pastas do front-end também segue um princípio de organização modular.

- **Injeção de Dependência:** Um padrão central no NestJS, usado para gerenciar e fornecer instâncias de serviços (`services`) e outras dependências (`guards`, `strategies`) de forma desacoplada.

- **Server-Side State Management (Front-end):** A aplicação utiliza React Query para gerenciar o estado que vem do servidor. Isso simplifica a busca de dados, o cache e a invalidação de cache após mutações.

- **Guards (Back-end):** O NestJS utiliza Guards para proteger rotas. Com a implementação de `JwtAuthGuard` (para verificar se o usuário está logado) e `RolesGuard` (para verificar permissões de acesso, como `USER` ou `ADMIN`).

- **Strategy Pattern (Back-end):** O sistema de autenticação com Passport.js aplica este padrão, onde a `JwtStrategy` é uma implementação concreta para validar tokens JWT.

- **Infrastructure as Code (IaC):** O uso de arquivos `Dockerfile`, `docker-compose.yml` e workflows do GitHub Actions (`.yml`) permite que toda a infraestrutura e os processos de automação sejam definidos e versionados como código.

## 🔥 **Como rodar o projeto localmente**

Este projeto utiliza Docker e Docker Compose para orquestrar os serviços necessários: frontend (React), backend (NestJS), banco de dados (PostgreSQL), e Nginx como reverse proxy.

#### ✅ Pré-requisitos

- [Docker](https://www.docker.com/)

#### 🚀 Subindo o projeto

1.  **Clone o repositório:**

```bash
git clone https://github.com/Sr-Husky/XP-Library.git
cd XP-Library/projeto
```

2. **Suba os containers:**

```bash
docker-compose up --build
```

**Importante:** Neste momento, a aplicação backend irá iniciar, mas provavelmente ficará reiniciando ou mostrando erros nos logs. Isso é **normal**, pois as tabelas do banco de dados ainda não foram criadas.

3. **Crie as tabelas do banco de dados (em outro cmd, ainda na pasta "XP-Library/projeto")**

```bash
docker-compose exec backend npx prisma migrate deploy
```

4. **Acesse a aplicação no navegador em:**

```
http://localhost
```

#### ⭐ Usando a aplicação:

- Clique em "Login"
- Faça o cadastro
- Faça Login usando seu email e senha
- Crie quantas experiências e usuários quiser para testar as interações