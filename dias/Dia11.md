# Dia 11 –  **Interações: Curtidas e Favoritos**

**Data:** 11/07/2025

## ✏ O que eu estudei/fiz hoje

- Vi que estava no planejamento criar um modulo novo só para as interações, que fiz com o gepeto, eu estranhei pois as interações são um recurso que está totalmente relacionado com o usuário, então eu intuitivamente iria implementar isso direto no modulo "user", mas pesquisando eu vi que isolar essa parte é uma vantagem, por questões de independência e modularidade.
- Executei os comandinhos para criar o modulo, `nest g XXXXX interact`, o nome "interact" foi o mais curto que achei que não prejudica a visibilidade, mas ainda ta muito longo aff.
- Quando voce vai executar mais de alteração no banco de dados que dependam uma da outra, voce pode usar um "transaction", isso faz com que quando uma das operações der errado, tudo seja cancelado para que não haja inconsistência de dados.
	- `await this.prisma.$transaction(async (tx) => {}`
	- É so colocar isso dentro de um bloco try, pois ele irá lançar erros caso algo dê errado, dentro dele voce coloca suas funções, porem ao invés de chamar `this.prisma.tabela` voce irá chamar `tx.tabela`
- Para incrementar um valor numérico no banco de dados, dá pra usar o `increment`:
	- `where: {id: 5}, data: {likes: {increment: 1}}`
	- Aqui ele irá incrementar 1 em likes da linha com id "5"
- Para incrementar um valor num vetor, dá pra usar o `push`:
	- `where: {id: userId}, data: {like: { push: cardId }}`
	- Aqui ele irá incrementar o valor "cardId" no vetor "like"
	- Não existe nenhuma forma parecida com essa pra remover um valor
- Fiz tudinho, inclusive a parte de tornar público ou privado, ao implementar no frontend, eu ví o quão é importante eu estruturar tudinho e fazer oque for necessário para modularizar e deixar tudo o mais legível possivel pois, especialmente em projetos grandes como esse, fica muito complicado de encontrar exatamente a parte que eu quero trocar ou modificar, e fica mais complicado ainda quando eu quero modificar algo que pode acabar quebrando o código todo, como adicionar uma coluna nova em alguma tabela do banco de dados, se eu tivesse esse conhecimento e soubesse exatamente oque eu estava fazendo desde o início (oque eu obviamente não sabia, estou aprendendo agora) eu teria feito tudo já pensando em, se eu precisar fazer uma modificação futura, deixar tudo prontinho para receber modificações, ou de uma forma centralizada para que eu tenha que modificar apenas algumas partes, eu atualmente fiz isso em várias partes do código, mas foi apenas seguindo boas praticas, agora eu vejo a importância real de tudo isso

## 💡 O que eu aprendi

✔ A vantagem de isolar funcionalidades em módulos próprios na API (como um módulo para "interações"), mesmo que relacionadas a outros, para aumentar a modularidade e a independência do código. 
✔ Como usar transações (`$transaction`) no Prisma para agrupar múltiplas operações de banco de dados, garantindo que, em caso de erro, todas as alterações sejam revertidas para manter a consistência dos dados. 
✔ A utilização de operações atômicas do Prisma para modificar dados diretamente no banco de forma segura, como `increment` para aumentar valores numéricos e `push` para adicionar itens a um campo de array. 
✔ A importância prática de um bom design de software, com código legível e modular, ao perceber como isso facilita manutenções e modificações futuras em projetos maiores sem quebrar o sistema. 

## 💻 Modificações

- Criado módulo "interact" para cuidas das interações de like e favoritos
- Criado rotas na API para adicionar/remover likes e favoritos
- Criado DTO para criar favoritos
- Adicionado botão para tornar público ou privar uma experiência
- Modificado varias partes do frontend para se adaptar as novas modificações