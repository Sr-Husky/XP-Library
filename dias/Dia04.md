# Dia 04 –  **Login, Cadastro e Estado do Usuário**

**Data:** 04/07/2025

## ✏ O que eu estudei hoje

- #### Página de login/cadastro
	- Pensando apenas sobre o funcionamento, o usuário deve ser capaz de usar a página "Home" mesmo sem estar logado, porem nesse caso ele fica limitado a apenas visualizar os cards, sem poder interagir com likes, favoritar ou postar. Para isso atualmente eu penso em de alguma forma fazer a navbar mostrar um botão de "Logout" quando o usuário estiver logado (e ao mesmo tempo exibir os botões para as outras páginas) e exibir o botão "Login" quando o usuário estiver deslogado. Quanto a página de login e cadastro, eu estou pensando em fazer elas juntas, e colocar cada uma em um card, só pra ficar bonitinho mesmo kkkk, mas sem usar modal pra não ficar muito "padrão"

- #### Estilos
	- Hoje foi basicamente só estilização, a construção da pagina em questão de react ou algumas coisas de lógica ta sendo extremamente facil, agora a estilização sempre tem alguma coisa que dá errado, certas coisas me fizeram perder horas, por isso hoje eu passei mais tempo aplicando estilos do que aprendendo algo novo de fato, eu nem tive tempo de ir anotando, mas eu ainda vou fazer uma anotação de todos os estilos que já usei e para que eles servem, afinal foi algo que eu aprendi

- #### addEventListener()
	- Voce pode usar um addEventListener() chamar uma função sempre que um evento especifico ocorrer
	- `addEventListener(<evento>, <função>)`
	- Para remover voce usa "removeEventListener"

- #### Regex
	- Voce pode criar tipo uma Gramatica regular para validar strings, se elas tem tais tipos de caracteres ou não
	- Exemplo: `/^[a-zA-Z0-9_\-.\+]+$/`
	- A sintaxe é bem confusa mas basicamente é isso:
		- `^` Início da string
		- `[ ... ]` conjunto de caracteres permitido
		- `$` Final da string
	- Tem muitas regrinhas, não acho que é algo que vale apena decorar, mas é bem útil, acho que vale apenas fazer um material de consulta

## 💡 O que eu aprendi
	
✔ Como planejar o fluxo de autenticação do usuário, diferenciando a interface e as funcionalidades disponíveis para usuários logados e deslogados. 
✔ A utilidade e a sintaxe básica de Expressões Regulares (Regex) para a validação de strings, como em formulários de login e cadastro. 
✔ Como usar `addEventListener()` para associar funções a eventos específicos e `removeEventListener()` para remover essa associação.
✔ Alguns tipos de estilização especificas

## 💻 Modificações

- Unificado /login e /casdatro em /entrar
- Criado componente botão
- Criado tela de login e cadastro
- Adicionado arquivo mockado de usuarios
- Adicionado logica de validação de email