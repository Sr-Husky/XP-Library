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

### **Semana 3 — Integração Front + API**

**🗓️ Período: 15/07 (segunda) a 21/07 (domingo)**  
**🎯 Objetivo da semana:** Frontend totalmente funcional, conectado com a API — com consumo real de dados, criação, edição e interação com experiencias.

#### 📌 Terça (15/07) — **Configuração de Consumo da API**
- Criar pasta `/services/api.ts`
- Definir funções reutilizáveis (ex: `getPublicexperiencias`, `postExperiencia`, etc)
- Criar um `env.ts` para gerenciar a baseURL da API
- Testar integração com console.log no front

#### 📌 Quarta (16/07) — **Integração da Página Inicial**
- Conectar o `GET /experiencias/publicas`
- Adicionar busca e filtro por tag no front (inputs que disparam o fetch)
- Exibir os dados reais na UI com loading/spinner

#### 📌 Quinta (17/07) — **Integração de Curtidas e Favoritos**
- Adicionar botões de curtir/favoritar nos cards
- Chamar rotas `POST /experiencias/:id/curtir` e `.../favoritar`
- Mostrar contagem de curtidas em tempo real
- Feedback visual ao clicar (ex: botão mudando de cor)

#### 📌 Sexta (18/07) — **Minhas experiencias e Favoritas**
- Na página `/minhas-experiencias`, integrar com `GET /experiencias` (do "usuário")
- Mostrar somente experiencias com `usuario_id` fixo (mockado no front)
- `/favoritas`: consumir lista de favoritas filtrando no front
- Exibir também botão de editar e deletar

#### 📌 Sábado (19/07) — **Criação e Edição de Experiencia**
- Conectar `/nova` com o `POST /experiencias`
- Ao editar, preencher o form com dados da Experiencia e enviar `PUT /experiencias/:id`
- Redirecionar após salvar

#### 📌 Domingo (20/07) — **Exclusão e UX Final**
- Implementar botão "Excluir" → chama `DELETE /experiencias/:id`
- Adicionar modais de confirmação (pode ser nativo ou custom)
- Garantir feedback visual em todas ações (loading, sucesso, erro)

#### 📌 Segunda (21/07) — **🧪 Revisão e Testes**
- Revisar todas as páginas com dados reais
- Criar lista de melhorias ou bugs encontrados
- Fazer post no LinkedIn

--- 

### **Semana 4 — Acabamentos**

**🗓️ Período: 22/07 (segunda) a 28/07 (domingo)**  
**🎯 Objetivo da semana:** Ter o sistema rodando 100% em ambiente de produção (Docker + Nginx), com ajustes finais na experiência do usuário, documentação técnica completa e repositório GitHub pronto.

#### 📌 Terça (22/07) — **Preparação para Produção**
- Gerar build do frontend com `vite build`
- Compilar backend com `npm run build`
- Criar estrutura de produção:
    - `/frontend/dist`
    - `/backend/dist`
- Separar `.env` para produção e desenvolvimento

#### 📌 Quarta (23/07) — **Docker Compose Final**
- Criar/ajustar `docker-compose.prod.yml` com:
    - React servido via Nginx (`/`)
    - NestJS backend (`/api`)
    - PostgreSQL
- Usar `Dockerfile` separado para cada serviço
- Garantir rede entre os containers

#### 📌 Quinta (24/07) — **Configuração do Nginx**
- Criar `nginx.conf`:
    - Redirecionar `/api` → NestJS
    - Servir arquivos estáticos do `frontend/dist`
- Adicionar container nginx ao `docker-compose`
- Testar todos os roteamentos:
    - Front acessível em `/`
    - API funcional via `/api`

#### 📌 Sexta (25/07) — **Ajustes Finais na UX/UI**
- Revisar responsividade (mobile/tablet)
- Melhorar UX:
    - Feedback visual de ações (curtir, favoritar, excluir)
    - Estados de carregamento (spinners)
    - Validações básicas no front

#### 📌 Sábado (26/07) — **Organização**
- Organizar tudo que for necessário em:
	- Estrutura de pastas de todo o projeto
	- Estrutura da logica de comunicação do back com o BD
	- Estrutura do código (função, componentes, serviços etc.)

#### 📌 Domingo (27/07) — **Revisão Técnica Geral**
- Rodar testes manuais completos:
    - Criar/editar/excluir experiencias
    - Curtir, favoritar
    - Busca e filtros
- Verificar funcionamento do sistema em ambiente Docker
- Procurar falhas

#### 📌 Segunda (28/07) — **Resumir tudo que aprendi**
- Finalmente o projeto está pronto e agora é so olhar para trás e retomar cada etapa e seus desafios
