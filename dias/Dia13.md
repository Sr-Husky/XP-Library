# Dia 13 –  **Refino e Documentação**

**Data:** 13/07/2025

## ✏ O que eu estudei hoje

- Hoje foi o dia que eu refiz o planejamento da minha API, eu estava entre encerrar o projeto mais cedo, como forma de cumprir objetivamente o com oque eu preestabeleci, ou aumentar a complexidade do projeto adicionando mais coisas que completem o projeto
- Fiz algumas pesquisas com IA e vi que é viável eu implementar tanto as modificações de segurança com o JWT, quanto as modificação de eficiência usando o React Query, além disso também vi outras possibilidades de coisas que posso fazer para complementar a quarta semana, implementando testes de software usando uma ferramenta do próprio Github
- Eu não sei exatamente como vou implementar tudo isso, e tudo que vou precisar mudar ou adaptar, mas é justamente por isso que estou fazendo, estou com medo de estar dando um passo maior do que a perna, em querer aprender tudo isso em tão pouco tempo, mas eu vou continuar, pois não acho que pode sair algum ruim disso, provavelmente vou continuar aplicando o conhecimento que consegui aqui em projetos futuros para manter o conhecimento fresco, talvez até mesmo misturar tudo que eu já sei com oque estou aprendendo agora, criando uma aplicação windows com integração com um serviço web, construindo uma aplicação windows e uma aplicação web que se complementem
- Sobre os testes usando o github, eu ainda não sei ao certo como funciona, mas o nome da ferramenta é GitHub Actions, eu configuro ele para fazer os teste pra mim, e sempre que eu fizer um "push", ele irá criar uma máquina virtual limpa, baixar o código, instalar tudo e rodar todos os seus testes.
- Aqui vai uma lista de todas coisas novas que eu pretendo aprender e implementar:
	- Autenticação com JWT
		- Access Token
		- Refresh Token
		- Usar "Guards"
		- Sistema de Roles (cargos, como `USER` e `ADMIN`)
	- React Query
		- Adaptar todas minhas chamadas da API
		- useQuery()
		- useMutation()
		- Tratar estados loading e error
	- Testes
		- Usar o Supertest para simular requisições HTTP 
		- GitHub Actions
- No final eu vou ter uma estrutura assim:
	- **Arquitetura de Software** (Front, Back, DB)
	- **Segurança** (JWT, Roles, HTTPS)
	- **Performance e UX** (React Query)
	- **Qualidade e Confiabilidade** (Testes Unitários e de Integração)
	- **DevOps e Automação** (Docker, CI/CD com GitHub Actions)
	- **Infraestrutura** (Nginx como Reverse Proxy)
- Pelo menos esse é oque eu vou ter se tudo correr perfeitamente, eu vou fazer de tudo por isso, mas o principal objetivo é aprender, e se eu não conseguir entregar algo ou entregar de forma incompleta, não tem problema, porque o valor do que eu estou fazendo não está no resultado final da aplicação e sim no meu aprendizado

## 💻 Modificações

- README modificado