# Dia 19 – **Refatoração Completa com React Query (Mutations)**

**Data:** 19/07/2025

## ✏ O que eu estudei hoje

- Acabei de reparar que eu já fiz todas meus objetivos de hoje, então eu já vou começar a pesquisar sobre os de amanhã.
- Amanhã vai ser o dia que eu dar uma introdução aos testes de software, que são formas de testar o software para ver se ele está funcionando como o esperado, e garantir que em casos de atualizações futuras no código, nada quebre sem que eu perceba
- Existem vários tipos de teste, os que eu vou usar amanhã serão os `teste unitários` e os `testes E2E`
- Os testes unitários servem para testar partes isoladas do meu código, como um método ou função específica, no meu caso eu vou testar as regras de negócios dos meus serviços, guards ou até mesmo controllers no backend, para garantir que eles funcionem mesmo sem depender do banco de dados
- Já os testes `E2E` (End-to-End) testam o fluxo completo da aplicação, como se eu estivesse realmente acessando a API via HTTP. Eu simulo uma requisição HTTP e espero para ver se a resposta é correta, o objetivo é verificar se está tudo funcionando junto (controller, service, banco, etc)
- Para isso vou usar duas ferramentas, o `Jest` e o `Supertest`
	- `Jest`: framework de testes que já vem por padrão com o NestJS.
		- Vou usar para testes unitários
	- `Supertest`: biblioteca para simular requisições HTTP nos testes E2E.
		- Vou usar junto com `Jest` para testes E2E
- Eu vou usar esses frameworks (como o Jest por exemplo) para organizar os testes com blocos como `describe`, `it`, `test`, executar os testes e mostrar se passaram ou falharam, fornecer funções utilitárias como `expect()` pra comparar resultados, simular dependências para testar coisas isoladas, criar relatórios e limpar o ambiente antes/depois dos testes.
- No caso eu vou escrever "códigos de teste" que são funções para testar outras funções, geralmente isso será colocado no arquivo `.spec.ts` de cada módulo (por convenção). O gepeto me deu o seguinte exemplo:
	- ```describe('AuthService', () => {
		  it('deve validar uma senha correta', () => {
			const resultado = authService.validatePassword('1234', hashDe1234);
			expect(resultado).toBe(true);
		  });
		});```
- Não parece nada muito complexo, é simplesmente chamar uma determinada função e comparar seu resultado, literalmente um teste kkkk, mas tem toda a organização pra isso
- Eu devo executar esses testes:
	- Antes de subir algo pro GitHub
	- Depois de fazer uma alteração importante
	- Antes de um deploy
	- Durante o desenvolvimento (para testar regras que você acabou de programar)
- E quando o projeto está bem testado, é comum rodar os testes automaticamente com CI (integração contínua), tipo no GitHub Actions (as peças estão começando a se encaixar agora)
- As vantagens de escrever testes formais ao invés de só ficar debugando colocando console.log() em todo lugar são:
	- Eu posso testar tudo automaticamente usando `npm run test`
	- Não deixa rastros de código, e ainda cria um histórico de tudo que foi testado
	- É ótimo para manter a qualidade sempre, durante qualquer etapa
- Para os testes unitários eu vou usar o Jest e ele tem a sua própria estrutura, dando só uma passada por cima:
	- Eu vou usar a função `describe()` para agrupar os testes que estão relacionados, no primeiro parâmetro eu passo um nome para os testes e no segundo uma função que ira executar os testes
	- Dentro da função do parâmetro eu devo colocar cada teste, porem eu posso colocar um `beforeEach()` que recebe uma função como parâmetro, isso servirá para dizer ao Jest que ele deve executar aquela função antes de cada teste.
	- Cada teste é especificado pela função `it()` que recebe um nome no primeiro parâmetro e no segundo a função que testa função alvo, geralmente eu chamo a função e coloco o retorno dela numa variável, e depois uso a estrutura `expect(variavel).toBe(resultado)` para fazer a comparação
	- E nos casos de funções que recebem parâmetros, eu vou usar dados mockados direto nos parâmetros
- Já os testes E2E vão usar enviar requisições de verdade e testar os seus retornos, aparente eu também vou usar o Jest pra isso, mas aqui também entra o `supertest`, dá pra usar um `beforeAll()` para colocar dados no banco de dados antes de testar
	- O `supertest` é uma biblioteca do Node.js que simula um cliente HTTP real, como se fosse um browser, envia dados para API e verifica os resultados
	- Então o fluxo básico vai ser instalar ele com o npm, importar ele no arquivo de código de teste, configurar teste como `beforeAll()` que será executado uma vez antes de começar e configurar o encerramento `afterAll()` que será executado uma vez depois de todos os testes. então eu vou escrever cada teste (`it()`) e nos teste vou usar a função `request()` com await para fazer cada requisição, esse função vem do `supertest`, depois da chamada da função eu vou fazer as comparações, eu já posso até fazer direto na função passando o retorno dela para os outros métodos do objeto retornado pelo request, assim:
		- ```await request(app.getHttpServer())
	      .post('/auth/login')
	      .send({ email: 'jean@teste.com', senha: '123456' })
	      .expect(200)
	      .expect(res => {expect(res.body).toHaveProperty('access_token');});```
- Dá pra ver um relatório com quantas funções foram testadas, quantas linhas foram executadas, quais arquivos ainda não têm testes, tudo isso executando o comando `npm run test:cov`
- Como o gepeto bem disse "Testar não é extra, é parte do desenvolvimento", ta ai algo que eu tenho que normalizar na minha rotina de desenvolvimento

## 💡 O que eu aprendi

✔ A diferença conceitual entre `testes unitários`, que testam partes isoladas do código, e `testes E2E` (End-to-End), que testam o fluxo completo da aplicação. 
✔ O papel do `Jest` como um framework para organizar (`describe`, `it`), executar e fazer asserções (`expect`) em testes. 
✔ A função da biblioteca `Supertest` para simular requisições HTTP reais em testes E2E, como se fosse um cliente acessando a API. 
✔ A estrutura básica de um arquivo de teste, utilizando blocos como `describe` para agrupar testes e `it` para definir um caso de teste específico. 
✔ Como utilizar hooks como `beforeEach()` para executar uma configuração antes de cada teste e `beforeAll()` para executar uma única vez antes de todos. 
✔ O fluxo de um teste E2E, que envolve fazer uma requisição com `request()`, enviar dados com `.send()` e verificar a resposta com `.expect()`. 
✔ A importância de integrar os testes na rotina de desenvolvimento, como antes de um deploy ou durante a integração contínua (CI). 