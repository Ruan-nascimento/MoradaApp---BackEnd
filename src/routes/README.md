# Routes

A pasta `routes` contém os arquivos que definem os endpoints da nossa API.

**Regras:**
- Aqui nós mapeamos qual método HTTP e qual caminho apontam para qual **Controller**.
- É o lugar ideal para adicionar os **Middlewares** em rotas específicas (ex: validação de token, upload de imagem).
- Recomendado centralizar tudo no arquivo `index.ts` desta pasta, juntando as rotas de cada módulo (ex: `user.routes.ts`, `auth.routes.ts`).
