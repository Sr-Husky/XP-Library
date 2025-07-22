# **XP Library**

Este projeto é parte de um desafio pessoal: aproveitar o mês de férias de julho para estudar desenvolvimento web, construindo um sistema completo com React, NestJS, PostgreSQL e Docker.

## ⚪ **Proposta do software**

Uma plataforma onde usuários compartilham frases, reflexões ou lições de vida aprendidas — organizadas por tema, com busca pública e interação social (favoritar, curtir). Nessa aplicação o usuário tem acesso a experiências de várias pessoas que compartilharam seus desafios e oque aprenderam com cada situação, além de também ser um espaço onde usuário pode compartilhar suas próprias experiências e ajudar, motivar e inspirar outras pessoas que podem estar passando pela mesma situação.

## 💡 **Motivação**

Percebi que programação web é uma ótima forma de começar minha carreira como programador, pois além de muito necessario no mercado atual, é algo que possibilita uma curva de aprendizado satisfatória, perfeito para mim que preciso gerenciar meu tempo entre faculdade e estudos.

## 🎯 **Objetivo**

Construir uma aplicação web completa (front e back) com base em breves experiências que tive com desenvolvimento web na faculdade — agora com foco total no aprendizado técnico real. Com o auxilio de IA para os estudos, eu pretendo anotar tudo que eu aprender e criar os códigos por conta própria

## 🧱 **Tecnologias planejadas**

- React (para o front-end)
- NestJS (para o back-end)
- Prisma (para comunicação com BD)
- PostgreSQL (banco de dados)
- Docker / Docker Compose (para estruturar e modularizar)
- Nginx (para simular produção)

## 💠 **Estrutura do projeto**

O objetivo é fazer commits diários, onde os arquivos do projeto mudam a cada commit, porem os arquivos de explicação de cada dia continuam os mesmo, a cada commit mais um arquivo de explicação do dia será adicionado com os detalhes do que foi feito e as anotações do que eu aprendi (dispensa a necessidade de voltar num commit especifico para ler oque foi feito)

```
/README.md            ← <Este arquivo>
/projeto/             ← código real, sempre atualizado
/dias/
├── Dia01.md          ← explicação do Dia 1
├── Dia02.md          ← explicação do Dia 2
...
```
## 🕒 **Planejamento de execução do projeto**

⚠ Obs: Esse planejamento servirá como guia para o projeto, portanto, ele é dinâmico podendo mudar com passar do tempo, coisas podem ser adicionadas, removidas ou modificadas.

### **Semana 1 — Ambiente, Front-end base e UI inicial**

**🗓️ Período: 01/07 (segunda) a 07/07 (domingo)**  
**🎯 Objetivo da semana:** Ter todas as páginas e componentes estruturais do front-end prontos (UI responsiva, rotas configuradas e estado básico), prontos para receber dados reais da API.

#### 📌 Terça (01/07) — **Planejamento + Setup Geral**
- Criar a ideia do projeto e montar um cronograma
- Criar estrutura do repositório no GitHub
- Instalar ferramentas

#### 📌 Quarta (02/07) — **Configuração do Front-end**
- Criar o `docker-compose.yml` inicial com containers (React, Nest, db, nginx, pgadmin — só estrutura, sem detalhes ainda)
- Iniciar projeto do frontend com Vite + React + Tailwind
- Configurar o TailwindCSS com Vite
- Criar estrutura de pastas (ex: `components`, `pages`, `hooks`, `services`, `contexts`)
- Configurar rotas com React Router DOM
- Criar layout base com navbar, rodapé e container
- Responsividade inicial com Tailwind

#### 📌 Quinta (03/07) — **Página Inicial + Busca**
- Criar página `/` com:
    - Campo de busca
    - Filtro por tag (estático por enquanto)
    - Lista de cards mockados de experiencias
- Criar componente `CardExperiencia`
- Criar componente `SearchBox`

#### 📌 Sexta (04/07) — **Login, Cadastro e Estado do Usuário**
- Criar páginas `/login` e `/cadastro`
- Mockar login (simular)
- Botão de logout e verificação de estado logado/deslogado

#### 📌 Sábado (05/07) — **Me + Favoritas**
- Criar página `/me`
    - Listagem mockada das experiencias do usuário logado
    - Botão "Nova Experiencia"
    - Botão de editar/deletar (sem funcionalidade real ainda)
- Criar página `/favoritas`
    - Listagem de experiencias favoritas (mockadas)

#### 📌 Domingo (06/07) — **Formulário de Criação/Edição**
- Criar página `/nova` com formulário:
    - Campo de texto
    - Campo de contexto (textarea)
    - Tags (seleção com multiselect ou input com split por vírgula)
    - Botão de publicar/salvar
- Reutilizar o mesmo formulário para edição (recebe dados mockados)

#### 📌 Segunda (07/07) — **🧪 Revisão e Ajustes**
- Testar cada página
- Ajustar pequenos bugs de layout/responsividade
- Criar um post no LinkedIn

---

### **Semana 2 — Backend (NestJS + Prisma) + Banco**

**🗓️ Período: 08/07 (segunda) a 14/07 (domingo)**  
**🎯 Objetivo da semana:** Criar uma API REST funcional com NestJS e Prisma, com rotas públicas e um banco de dados real, pronta para integração com o front. Sem autenticação nem validações complexas.

#### 📌 Terça (08/07) — **Setup do Backend + Docker + Prisma**
- Criar projeto NestJS com `nest new api`
- Configurar `docker-compose.yml` com containers:
    - PostgreSQL
    - pgAdmin
- Conectar NestJS ao banco com `@prisma/client`
- Criar `schema.prisma` com tabelas:
    - `Usuario`: id, nome, email, criado_em
    - `Experiencia`: id, usuario_id, texto, contexto, tags\[\], publicado, criado_em
    - `Curtida` e `Favorito`: id, usuario_id, Experiencia_id
- Rodar `npx prisma migrate dev` para gerar banco e client

#### 📌 Quarta (09/07) — **Listagem Pública de experiencias**
- Criar módulo `experiencias`
- Rota pública: `GET /experiencias/publicas`
    - Com suporte a `?busca=` (texto/contexto) e `?tag=`
- Inserir alguns registros diretamente no banco para testar

#### 📌 Quinta (10/07) — **CRUD Básico de experiencias (sem login)**
- Rotas:
    - `GET /experiencias`
    - `POST /experiencias`
    - `PUT /experiencias/:id`
    - `DELETE /experiencias/:id`
- Toda Experiencia terá um `usuario_id`, passado diretamente no corpo da requisição

#### 📌 Sexta (11/07) — **Interações: Curtidas e Favoritos**
- Criar módulo `interacoes`
- Rotas:
    - `POST /experiencias/:id/curtir`
    - `POST /experiencias/:id/favoritar`
- Alternância (se já existe → remove; senão → adiciona)
- Criar contagem de curtidas em cada Experiencia (usado na listagem pública)

#### 📌 Sábado (12/07) — **CRUD de Usuários (simples)**
- Módulo `usuarios`
- Rotas:
    - `GET /usuarios`
    - `POST /usuarios`
    - `GET /usuarios/:id`
- Usuário será identificado apenas por ID em outras ações
- Sem hash, sem login, sem token — apenas para vínculo e testes

#### 📌 Domingo (13/07) — **Refino e Documentação**
- Refatorar nomes, separar serviços, limpezas
- Testar todas as rotas com Insomnia/Postman
- Escrever documentação básica no README (rotas e exemplos)

#### 📌 Segunda (14/07) — **🧪 Revisão Final**
- Testar todas as rotas com dados reais no banco
- Corrigir falhas
- Postar no LinkedIn

---

### **Semana 3 — Fortalecimento e Segurança da Aplicação**

**🗓️ Período: 15/07 (terça) a 21/07 (segunda)** **🎯 Objetivo da semana:** Implementar um sistema de autenticação e autorização completo, modernizar o gerenciamento de estado do frontend com uma biblioteca de ponta (React Query) e iniciar a cultura de testes no projeto.

#### 📌 Terça (15/07) — **Setup da Autenticação no Backend**
- **Foco:** Backend (NestJS)
- Instalar dependências de autenticação (`@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`).
- Criar o `AuthModule`.
- Implementar a `JwtStrategy` e o `AuthService` com métodos para `login` (gerar tokens) e `validateUser`.
- Criar a rota `POST /login` no `AuthController`.
- Criar um `JwtAuthGuard` para proteger rotas.

#### 📌 Quarta (16/07) — **Integração da Autenticação no Frontend**
- **Foco:** Frontend (React)
- Conectar a página `/entrar` para chamar os endpoints reais da API.
- Criar um Contexto de Autenticação (`AuthContext`) ou um hook para gerenciar o estado do usuário e os tokens (salvando no `localStorage`).
- Implementar rotas protegidas com React Router DOM, que redirecionam para `/login` caso o usuário não esteja autenticado.

#### 📌 Quinta (17/07) — **Autorização por Roles e Refino no Backend**
- **Foco:** Backend (NestJS)
- Adicionar um campo `role` (`'USER'` ou `'ADMIN'`) ao `schema.prisma` do `Usuario`.
- Criar um `RolesGuard` que verifica os cargos permitidos para uma rota.
- Proteger rotas críticas, como `DELETE /experiencias/:id`, permitindo o acesso apenas ao dono da experiência ou a um admin.
- Implementar o fluxo de "Refresh Token" para manter o usuário logado de forma segura.

#### 📌 Sexta (18/07) — **Introdução ao React Query e Refatoração da Home**
- **Foco:** Frontend (React)
- Instalar `TanStack Query (React Query)`.
- Configurar o `QueryClientProvider` na raiz da aplicação.
- Refatorar a busca de dados da página inicial (`/`), trocando os `useEffect`s e `useState`s por um único hook `useQuery`.
- Implementar estados de `isLoading` (ex: exibir um spinner) e `isError` (exibir mensagem de erro) de forma declarativa.

#### 📌 Sábado (19/07) — **Refatoração Completa com React Query (Mutations)**
- **Foco:** Frontend (React)
- Refatorar todas as ações que modificam dados (criar, editar, deletar, curtir, favoritar) para usar o hook `useMutation`.
- Implementar invalidação de queries (`queryClient.invalidateQueries`) após uma `mutation` de sucesso para que a UI seja atualizada automaticamente com os novos dados do servidor.
- **Desafio opcional:** Implementar uma "Atualização Otimista" (Optimistic Update) na ação de curtir para que a UI responda instantaneamente.

#### 📌 Domingo (20/07) — **Escrevendo os Primeiros Testes (Backend)**
- **Foco:** Backend (NestJS)
- Escrever testes unitários para as regras de negócio de um dos seus `services` (ex: `AuthService`).
- Escrever um teste de integração (E2E) para um `controller`, usando Supertest para simular requisições HTTP e validar as respostas da API, como o status code e o corpo da resposta.

#### 📌 Segunda (21/07) — **🧪 Revisão da Semana**
- Revisar todo o fluxo de autenticação e o uso do React Query.
- Fazer o post da semana no LinkedIn, focando no aprendizado sobre autenticação JWT e gerenciamento de estado moderno.

---

### **Semana 4 — Nível Profissional: Automação e Deploy**

**🗓️ Período: 22/07 (terça) a 28/07 (segunda)** **🎯 Objetivo da semana:** Automatizar o processo de teste e deploy com CI/CD, configurar um ambiente de produção robusto e profissional com Nginx e HTTPS, e finalizar a documentação do projeto para transformá-lo em um portfólio de alto impacto.

#### 📌 Terça (22/07) — **Preparação para Produção e Docker Compose Final**
- **Foco:** Docker
- Criar os builds de produção do front (`npm run build` no React) e do back (`npm run build` no Nest).
- Criar um `Dockerfile` multi-stage para cada serviço (front e back) para gerar imagens otimizadas e menores.
- Criar um arquivo `docker-compose.prod.yml` que orquestra os serviços de produção: Nginx, NestJS (rodando o build de `/dist`), e PostgreSQL (com volume persistente).

#### 📌 Quarta (23/07) — **Configuração do Nginx como Reverse Proxy**
- **Foco:** Nginx e Docker
- Escrever o arquivo de configuração `nginx.conf`.
- Configurar o Nginx para:
    1. Servir os arquivos estáticos do build do React na rota raiz (`/`).
    2. Atuar como um reverse proxy, redirecionando todas as chamadas para `/api/*` para o container do NestJS.
- Testar toda a aplicação rodando localmente com `docker-compose -f docker-compose.prod.yml up`.

#### 📌 Quinta (24/07) — **CI/CD Parte 1: Automação de Testes (GitHub Actions)**
- **Foco:** GitHub Actions
- Criar a pasta `.github/workflows` no seu repositório.
- Criar um workflow em YAML (`test.yml`) que é acionado a cada `push` ou `pull_request`.
- O workflow deve:
    - Fazer o checkout do código.
    - Instalar as dependências do front e do back.
    - Rodar os testes (`npm test`) de ambos os projetos.
    - Exibir um status de sucesso ou falha no GitHub.

#### 📌 Sexta (25/07) — **CI/CD Parte 2: Automação do Deploy (GitHub Actions)**
- **Foco:** GitHub Actions e DevOps
- Criar um segundo workflow (`deploy.yml`) que é acionado apenas em `push` para a branch `main`.
- O workflow deve:
    - Fazer o build das imagens Docker do front e do back.
    - Fazer login em um registro de containers (Docker Hub ou GitHub Container Registry).
    - Enviar (push) as imagens para o registro.

#### 📌 Sábado (26/07) — **Deploy Real em Servidor com HTTPS**
- **Foco:** Infraestrutura e Segurança
- (Assumindo que vou ter um domínio e um servidor/VPS) Apontar seu domínio para o IP do servidor.
- Executar o workflow de deploy para colocar a aplicação no ar.
- No servidor, instalar o **Certbot** e usá-lo para gerar um certificado SSL/TLS gratuito da Let's Encrypt para o seu domínio, configurando o Nginx para forçar o uso de HTTPS.

#### 📌 Domingo (27/07) — **Documentação Final e Polimento do Portfólio**
- **Foco:** Documentação
- Atualizar o `README.md` de forma massiva: adicionar seções sobre a arquitetura, as decisões técnicas, como rodar o projeto localmente (dev e prod), e documentar as variáveis de ambiente.
- Adicionar documentação da API usando o Swagger, que pode ser gerado automaticamente pelo NestJS.
- Gravar um GIF ou vídeo curto demonstrando a aplicação e o fluxo de CI/CD.

#### 📌 Segunda (28/07) — **🚀 Lançamento e Retrospectiva Final**
- Fazer uma revisão completa e final do sistema em produção.
- Escrever o post final no LinkedIn sobre o desafio de 1 mês, compartilhando o link do projeto no GitHub e o link da aplicação no ar. Detalhe os aprendizados e as tecnologias utilizadas (dar ênfase em JWT, React Query, Testes e CI/CD!).
- Olhar para trás, revisar todos os seus commits e anotações dos `dias/`, e consolidar seu aprendizado.
- Comemorar!