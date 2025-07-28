# Dia 27 – **Documentação Final e Polimento do Portfólio**

**Data:** 27/07/2025

## ✏ O que eu estudei hoje

- Comecei pelo começo: garantir que as instruções para rodar o projeto funcionassem perfeitamente. Mal sabia eu que estava prestes a entrar num labirinto de configurações do Docker e do Prisma. 
- A primeira versão deu problema porque eu precisava de arrumar alguma forma de gerar o prisma client, que era gerado com o comando `prisma generate`
- Conversei com o Gemini e a primeira suspeita foi o `Dockerfile.backend`. A gente tentou de tudo: copiar a pasta `.prisma` da etapa de build para a de produção, reinstalar as dependências de produção com `--omit=dev`. Cada tentativa eu tinha que fazer um monte de coisa: alterar o `Dockerfile`, rodar `docker-compose down -v` e `docker system prune -a -f`  e mesmo assim so dava problema
- Depois de várias tentativas, a gente percebeu que o problema era mais profundo. O `prisma generate` não estava rodando automaticamente. Eu adicionei `"postinstall": "prisma generate"` no `package.json`.  E finalmente deu certo, so que quando eu clonava o projeto e tentava fazer tudo num ambiente limpo, como se fosse um usuário mesmo, dava problema pois ele detectava que já tinha um banco de dados e por isso não fazia oque deveria, então eu tive que apagar a pasta `pgdata` para que finalmente desse certo também no ambiente limpo
- O problema era que agora eu não tinha nada no banco de dados, então eu ainda tive um monte de problema ate descobrir que eu precisaria refazer o `prisma migrate`, fiquei horas tentando automatizar isso e não deu certo, nessas horas eu também tentei automatizar uns dados mockados no banco de dados via "seed" para usar como exemplo, mas também não eu certo, eu tentei de tudo, mas parece que hoje o satanás tirou o dia pra me infernizar
- Enfim, na versão final, o usuário consegue executar minha aplicação normalmente na máquina dele, ele so precisa clonar o meu repositório, subir os containers, fazer o "migrate" manualmente com um comandinho quando os containers subirem, e depois criar os usuário e as experiências da forma como quiser, por um lado isso é bom pois o usuário tem o poder de personalizar tudo e criar tudo do absoluto zero.
## 💡 O que eu aprendi

✔ A importância de garantir que o Prisma Client seja gerado (`prisma generate`) durante o processo de build do Docker para que a aplicação de produção funcione corretamente. 
✔ Como usar um script `postinstall` no `package.json` para automatizar a execução de comandos, como o `prisma generate`, após a instalação das dependências. 
✔ O processo de depuração de builds do Docker, incluindo a limpeza de volumes (`docker-compose down -v`) e do sistema (`docker system prune`) para evitar problemas de cache durante os testes. 
✔ O conceito de "seeding" do banco de dados para popular com dados iniciais, mesmo que a implementação não tenha sido bem-sucedida na prática. 
✔ Como a persistência de dados em volumes do Docker (no caso, a pasta `pgdata`) pode afetar a simulação de um ambiente de instalação limpo e como sua remoção é necessária para testar o fluxo de um novo usuário.

## 💻 Modificações

- Modificado `package.json`, `nest-cli.json` e `Dockerfile.backend` para configurar o banco de dados durante o build
- Configurado o swagger
- Criado novo README com informações do projeto finalizado