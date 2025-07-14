# Dia 14 –  **Revisão Final**

**Data:** 14/07/2025

## ✏ O que eu estudei hoje

- Todas modificações que eu queria fazer eu já fiz, eu dei mais uma revisada mas não encontrei nada que preciso trocar, apenas troquei o nome dos modais de confirmação para ficarem mais claros
- Resolvi ver melhor tudo que vou precisar fazer amanhã quando for implementar o JWT, o Gemini me mostrou um exemplo muito bom, é como se existisse um porteiro, o "cadastro" seria eu me apresentar pra ele, eu informo meu email e minha senha, então ele irá me registrar e ira criptografar minha senha e colocar a versão dela criptografada no banco de dados, e então sempre que eu quiser entrar eu forneço minha senha e ele ira criptografar essa senha também e comparar com a senha criptografada que está no banco de dados, se for a mesma, ele me vai me dar um "Cartão de Acesso" que seria o token, esse token tem minha identificação e um prazo de validade, e é assinado pelo porteiro para provar que é autêntico, toda vez que eu for acessar alguma informação ou fazer alguma ação que precisa de autenticação eu vou mostrar o meu token, assim que eu quiser sair, que seria o logout, eu apenas jogaria o cartão fora, que seria apagar o token do meu navegador.
- Para implementar isso eu vou ter que criar outro modulo que vai ser o de autenticação (por questão de boas praticas e organização), pelo oque eu vi até agora vai ficar mais ou menos assim:
	- Vou configurar meu axios para sempre tentar pegar o token, que vou sempre colocar no localStorage, e usar esse token no header de todas as requisições que eu fizer, o nome disso é "interceptor" e ele roda antes de qualquer requisição. Então para qualquer requisição que eu fizer no back ele vai executar esse interceptor e colocar o token no meio da requisição (no campo chamado "header").
	- Essa requisição vai chegar no backend em um controller e vai chamar uma função que esta declarado com o decorator "@UseGuards(JwtAuthGuard)", isso é oque irá validar o token usando oque vai estar no arquivo "jwt.strategy.ts" que eu também vou ter que criar
	- Nesse arquivo "jwt.strategy.ts" eu pego o token e uso uma "secretKey", que vou definir num arquivo .env,  para assinar a requisição, se a assinatura for igual ao token que foi enviado, então é um acesso legitimo e a requisição é processada, se não for, é lançado o erro 401
- Para fazer login vai ser mais ou menos assim:
	- Eu envio meu login minha senha, a senha é criptografada e comparada com a versão criptografada da senha original que esta no banco de dados, isso é feito numa função que eu tenho que criar que vou chamar de "validateUser"
	- Se o usuário for valido, a função "validateUser" vai retornar o objeto do usuário (sem a senha), esse retorno vai ser usado pela função que vamos chamar de login(), agora então eu chamo a função "login" e passo como parametro o objeto do usuário
	- Na função login eu vou criar um payload com o usuário e o id, e vai ser esse payload que eu vou assinar e enviar como token, que será o retorno da função login(), o token.
- Amanha eu vou destrinchar tudo isso e entender como tudo funciona por baixo dos panos, além de aplicar no meu projeto é claro
