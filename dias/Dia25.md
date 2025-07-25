# Dia 25 – **CI/CD Parte 2: Automação do Deploy (GitHub Actions)**

**Data:** 25/07/2025

## ✏ O que eu estudei/fiz hoje

- O objetivo de hoje é automatizar o envio da minha aplicação para algum serviço de registro de containers, para isso eu posso usar tanto o Docker Hub quanto o GitHub Container Registry, eu não sabia da importância disso até pesquisar aqui agora
- Vou criar um workflow para que sempre que eu fizer um push para o branch "main", essa imagem seja automaticamente enviada para o registro de container, esse registro de container é onde o servidor (seja la qual servidor eu esteja usando) vai pegar a minha aplicação e baixar para rodar em produção, essa é uma forma de controle de deploy, eu posso atualizar outros "branch" e isso fica apenas como atualizações em desenvolvimento, mas ao fazer o merge para o "main" ele já envia para o registro e o servidor já puxa ele para usar em produção
- Resumindo, eu vou ter minhas imagens, que são meio que um snapshot pronto pra roda, que vai rodar igual em todo lugar, com o meu código, o node, as bibliotecas, as configurações de ambiente e comando que dizem como iniciar a aplicação, essas imagens (front, back e db) serão hosteadas por um serviço, e eu vou poder baixa-las e usa-las em qualquer lugar que no caso vai ser um servidor que ir subir as imagens com `docker-compose`
- Para criar essas imagens é preciso de usar uns comando no YAML que eu nunca vi, o código todo foi gerado pelo gepeto e eu não puder fazer nada, é o tipo de coisa que eu tenho que decorar, mas basicamente ele usa alguns comandos no parâmetro "`uses`" do "`steps`" como `docker/setup-buildx-action@v3` para iniciar o serviço, `docker/login-action@v3` para fazer o login passando os parâmetros `username` e `password`, esse username e password são os do Docker Hub, que eu acabei de criar e colocar nos "secrets" do meu repositório, e depois ele usa `docker/build-push-action@v5` para fazer o build de cada imagem a partir do `Dockerfile`, por isso eu também tive que criar um Dockerfile para o nginx pois ele também irá precisa de uma imagem, já no caso do banco de dados, eu não vou precisar pois ele não será um container no docker, a imagem do banco de dados vai estar separada em algum serviço gratuito, aí eu só vou pegar a URL e passar como variável de ambiente para o meu backend usar.
- Eu acabei de testar num repositório de teste e consegui fazer dar certo, agora só vou terminar de escrever esse arquivo do dia 25 e fazer o push, estava tendo alguns erros com diretório mas agora ta tudo certo

## 💡 O que eu aprendi

✔ O conceito de Deploy Contínuo (CD) e como automatizá-lo com o GitHub Actions para enviar imagens da aplicação para um registro de containers, como o Docker Hub. 
✔ A importância de um registro de containers para hospedar as imagens prontas para serem usadas em um ambiente de produção. 
✔ Como acionar um workflow de deploy apenas em eventos específicos, como um `push` para o branch `main`. 
✔ A utilização de ações prontas do Docker no GitHub Actions, como `docker/login-action` para autenticação e `docker/build-push-action` para construir e enviar as imagens. 
✔ A decisão de arquitetura de usar um serviço de banco de dados externo em produção, conectando-se a ele através de uma URL em uma variável de ambiente, em vez de gerenciar um container de banco de dados próprio no deploy.

## 💻 Modificações

 - Adicionado `Dockerfile` para `Nginx`
 - Adicionado workflow `deploy.yml` 