# 📡 API Routes — MoradaApp Backend

> **Base URL:** `http://localhost:<PORT>/api`

Todas as rotas são prefixadas com `/api`. Exemplo: `POST /api/login`.

---

## 🔓 Rotas Públicas (sem token)

Essas rotas **não exigem autenticação**. Qualquer requisição válida será processada.

---

### `POST /login`

Autentica o usuário e retorna um **token JWT** válido por 7 dias.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `200` | Login bem-sucedido | `{ "token": "eyJhbG...", "success": true }` |
| `400` | Campos faltando | `{ "message": "Email e senha são obrigatórios", "success": false }` |
| `400` | Email não cadastrado | `{ "message": "Usuário não encontrado", "success": false }` |
| `400` | Senha incorreta | `{ "message": "Credenciais Inválidas", "success": false }` |
| `500` | Erro interno | `{ "message": "Erro desconhecido ao fazer login...", "success": false }` |

**Fluxo interno:**
1. Valida se `email` e `password` foram enviados
2. Busca o usuário no banco pelo `email`
3. Compara a senha com `bcrypt.compare`
4. Gera um JWT com o `id` do usuário (expira em 7 dias)
5. Retorna o token

---

### `POST /cadastro`

Cria um novo usuário no banco de dados.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "novo@email.com",
  "password": "senha123",
  "name": "Lucas Silva"
}
```

**Validações aplicadas:**
- **Email** → deve conter `@` e `.` (regex)
- **Senha** → mínimo 6 caracteres
- **Nome** → mínimo 3 caracteres

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `201` | Cadastro realizado | `{ "message": "Usuário cadastrado com sucesso!", "success": true }` |
| `400` | Email inválido | `{ "message": "Email inválido. Exemplo: morada@gmail.com", "success": false }` |
| `400` | Senha curta | `{ "message": "Senha inválida. Tente uma senha com 6 caracteres ou mais.", "success": false }` |
| `400` | Nome curto | `{ "message": "Nome inválido. Tente um nome com 3 caracteres ou mais.", "success": false }` |
| `400` | Email já existe | `{ "message": "Usuário já existe, Faça Login", "success": false }` |
| `500` | Erro interno | `{ "message": "Erro desconhecido ao cadastrar usuário...", "success": false }` |

**Fluxo interno:**
1. Valida email, password e name
2. Verifica se o email já existe no banco
3. Faz hash da senha com `bcrypt` (salt 10)
4. Cria o usuário com o nome em lowercase e sem espaços extras
5. Retorna mensagem de sucesso

---

## 🔐 Rotas Protegidas (exigem token)

Essas rotas passam pelo `authMiddleware` **antes** do controller. O middleware:
1. Extrai o token do header `Authorization: Bearer <token>`
2. Verifica e decodifica o JWT
3. Injeta `req.userId` com o ID do usuário autenticado
4. Se o token for inválido/ausente, retorna `401` e bloqueia o acesso

**Header obrigatório em TODAS as rotas protegidas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Erros do middleware:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `401` | Sem header Authorization | `{ "message": "Token não enviado", "success": false }` |
| `401` | Token expirado ou inválido | `{ "message": "Token inválido ou expirado", "success": false }` |

---

### `GET /me`

Retorna os dados do **usuário logado**, incluindo suas reservas.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** nenhum (é GET)

**Resposta de sucesso (`200`):**
```json
{
  "user": {
    "id": "c1231719-c225-494b-b849-02f1e2917071",
    "email": "usuario@email.com",
    "name": "Lucas Silva",
    "reservas": [
      {
        "id": "a1b2c3d4-...",
        "nome": "Restaurante Sabor Nordestino",
        "data": "2026-05-20",
        "hora": "12:30",
        "userId": "c1231719-...",
        "createdAt": "2026-05-19T...",
        "updatedAt": "2026-05-19T..."
      }
    ]
  },
  "success": true
}
```

**Respostas de erro:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `400` | Usuário não encontrado no banco | `{ "message": "Usuário não encontrado", "success": false }` |
| `500` | Erro interno | `{ "message": "Erro desconhecido ao buscar usuário...", "success": false }` |

**Fluxo interno:**
1. O middleware já injetou `req.userId`
2. Busca o usuário pelo `id` com `select` (id, email, name, reservas)
3. Retorna o objeto do usuário com todas as suas reservas

---

### `GET /get-all-data`

Retorna **todas as reservas** cadastradas no banco de dados.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** nenhum (é GET)

**Resposta de sucesso (`200`):**
```json
{
  "data": [
    {
      "id": "a1b2c3d4-...",
      "nome": "Restaurante Sabor Nordestino",
      "data": "2026-05-20",
      "hora": "12:30",
      "userId": "c1231719-...",
      "createdAt": "2026-05-19T...",
      "updatedAt": "2026-05-19T..."
    },
    {
      "id": "e5f6g7h8-...",
      "nome": "Clínica Vida Mais",
      "data": "2026-05-21",
      "hora": "09:00",
      "userId": "c1231719-...",
      "createdAt": "2026-05-19T...",
      "updatedAt": "2026-05-19T..."
    }
  ],
  "success": true
}
```

**Respostas de erro:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `404` | Nenhum dado encontrado | `{ "message": "Nenhum dado encontrado", "success": false }` |
| `500` | Erro interno | `{ "message": "Erro ao buscar dados", "success": false }` |

**Fluxo interno:**
1. Busca todas as reservas com `prisma.reservas.findMany()`
2. Se a lista estiver vazia, retorna `200` com array vazio
3. Se houver dados, retorna `200` com o array completo

---

## 📋 Resumo Rápido

|   Método    |          Rota            | Auth |                    Descrição                       |
|-------------|--------------------------|------|----------------------------------------------------|
| `POST`      | `/api/login`             |  ❌  | Autentica e retorna JWT |
| `POST`      | `/api/cadastro`          |  ❌  | Cria novo usuário |
| `GET`       | `/api/me`                |  🔐  | Dados do usuário logado + reservas |
| `GET`       | `/api/get-all-data`      |  🔐  | Todas as reservas do banco |
| `POST`      | `/api/criar-reserva`     |  🔐  | Cria nova reserva |
| `POST`      | `/api/listar-reservas`   |  🔐  | Lista reservas do usuário |
| `DELETE`    | `/api/cancelar-reserva`  |  🔐  | Cancela uma reserva |

---

## 🧪 Testando com cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@email.com", "password": "senha123"}'
```

**Cadastro:**
```bash
curl -X POST http://localhost:3000/api/cadastro \
  -H "Content-Type: application/json" \
  -d '{"email": "novo@email.com", "password": "senha123", "name": "João Silva"}'
```

**Me (autenticado):**
```bash
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
```

**Get All Data (autenticado):**
```bash
curl -X GET http://localhost:3000/api/get-all-data \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
```
