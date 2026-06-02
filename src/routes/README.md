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

### `GET /imoveis`

Lista todos os imóveis disponíveis com **paginação**.

**Query Params:**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `page` | number | `1` | Página atual |
| `limit` | number | `16` | Itens por página |

**Resposta de sucesso (`200`):**
```json
{
  "data": [
    {
      "id": "abc-123",
      "title": "Apartamento em Boa Viagem",
      "photo": "https://...",
      "uf": "PE",
      "city": "Recife",
      "price": 150,
      "reviews": [{ "stars": 5 }, { "stars": 4 }]
    }
  ],
  "total": 48,
  "page": 1,
  "limit": 16,
  "hasNextPage": true
}
```

**Respostas de erro:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `500` | Erro interno | `{ "success": false, "message": "Erro ao buscar os imóveis" }` |

---

### `GET /imoveis/:id`

Retorna um imóvel específico com **host**, **highlights** e **reviews**.

**Params:**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | ID do imóvel |

**Resposta de sucesso (`200`):**
```json
{
  "data": {
    "id": "abc-123",
    "title": "Apartamento em Boa Viagem",
    "photo": "https://...",
    "uf": "PE",
    "city": "Recife",
    "price": 150,
    "host": {
      "id": "host-1",
      "name": "Maria",
      "photo": "https://...",
      "createdAt": "2026-01-01T..."
    },
    "highlights": [
      { "id": "h-1", "name": "Wi-Fi" }
    ],
    "reviews": [
      {
        "id": "r-1",
        "name": "João",
        "imgUser": "https://...",
        "stars": 5,
        "comment": "Excelente!",
        "createdAt": "2026-05-01T..."
      }
    ]
  },
  "success": true
}
```

**Respostas de erro:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `400` | ID não fornecido | `{ "success": false, "message": "ID do imóvel não fornecido" }` |
| `404` | Imóvel não encontrado | `{ "success": false, "message": "Imóvel não encontrado" }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro ao buscar o imóvel" }` |

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
        "imoveisId": "xyz-789",
        "chekIn": "2026-05-20T12:00:00.000Z",
        "chekOut": "2026-05-22T12:00:00.000Z",
        "finalValue": 300,
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
| `500` | Erro interno | `{ "message": "Erro ao buscar usuário...", "success": false }` |

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
      "imoveisId": "xyz-789",
      "chekIn": "2026-05-20T12:00:00.000Z",
      "chekOut": "2026-05-22T12:00:00.000Z",
      "finalValue": 300,
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
| `500` | Erro interno | `{ "message": "Erro ao buscar dados", "success": false }` |

---

### `POST /criar-reserva`

Cria uma nova reserva para o usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "imoveisId": "abc-123",
  "chekIn": "2026-06-10",
  "chekOut": "2026-06-12"
}
```

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `201` | Reserva criada | `{ "success": true, "message": "Reserva criada com sucesso!", "data": { ... } }` |
| `400` | Dados incompletos | `{ "success": false, "message": "Dados incompletos para criar reserva." }` |
| `400` | Conflito de datas | `{ "success": false, "message": "Este imóvel já está reservado no período selecionado." }` |
| `401` | Não autenticado | `{ "success": false, "message": "Usuário não autenticado." }` |
| `404` | Usuário/Imóvel não encontrado | `{ "success": false, "message": "Imóvel não encontrado." }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro interno do servidor ao criar reserva." }` |

**Fluxo interno:**
1. Valida dados obrigatórios (`imoveisId`, `chekIn`, `chekOut`)
2. Verifica existência do usuário e do imóvel
3. Normaliza datas para 12h
4. Verifica conflito de datas (evita double-booking)
5. Calcula valor final (preço × noites)
6. Cria a reserva no banco

---

### `POST /confirmar-reserva`

Confirma a reserva no banco de dados após verificação de conflitos.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "imoveisId": "abc-123",
  "chekIn": "2026-06-10",
  "chekOut": "2026-06-12",
  "finalValue": 300,
  "pixCode": "00020126...",
  "pixQrCodeBase64": "data:image/png;base64,..."
}
```

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `201` | Reserva confirmada | `{ "success": true, "message": "Reserva confirmada com sucesso!", "data": { ... } }` |
| `400` | Dados insuficientes | `{ "success": false, "message": "Dados insuficientes para confirmar a reserva." }` |
| `400` | Conflito de datas | `{ "success": false, "message": "Este imóvel já foi reservado por outro usuário para esse período." }` |
| `401` | Não autenticado | `{ "success": false, "message": "Usuário não autenticado." }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro interno do servidor ao confirmar a reserva." }` |

**Fluxo interno:**
1. Valida dados obrigatórios (`imoveisId`, `chekIn`, `chekOut`, `finalValue`)
2. Normaliza datas e verifica conflito de datas
3. Cria a reserva no banco


---

### `POST /listar-reservas`

Lista todas as reservas do usuário autenticado com dados do imóvel.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:** nenhum (usa userId do token)

**Resposta de sucesso (`200`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "res-123",
      "imoveisId": "abc-123",
      "userId": "user-1",
      "chekIn": "2026-06-10T12:00:00.000Z",
      "chekOut": "2026-06-12T12:00:00.000Z",
      "finalValue": 300,
      "imoveis": {
        "id": "abc-123",
        "title": "Apartamento em Boa Viagem",
        "photo": "https://...",
        "city": "Recife",
        "uf": "PE",
        "price": 150
      }
    }
  ]
}
```

**Respostas de erro:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `401` | Não autenticado | `{ "success": false, "message": "Usuário não autenticado." }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro interno ao listar reservas." }` |

---

### `DELETE /cancelar-reserva`

Cancela (deleta) uma reserva do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON) ou Query:**
```json
{
  "id": "res-123"
}
```
Ou via query string: `?id=res-123`

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `200` | Reserva cancelada | `{ "success": true, "message": "Reserva cancelada com sucesso." }` |
| `400` | ID não fornecido | `{ "success": false, "message": "ID da reserva não fornecido." }` |
| `401` | Não autenticado | `{ "success": false, "message": "Usuário não autenticado." }` |
| `403` | Sem permissão | `{ "success": false, "message": "Você não tem permissão para cancelar esta reserva." }` |
| `404` | Reserva não encontrada | `{ "success": false, "message": "Reserva não encontrada." }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro interno do servidor ao cancelar reserva." }` |

**Fluxo interno:**
1. Extrai o ID da reserva do body ou query string
2. Busca a reserva e verifica se pertence ao usuário
3. Se pertence, deleta a reserva

---

### `POST /adicionar-favorito`

Adiciona um imóvel aos favoritos do usuário.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "imoveisId": "abc-123"
}
```

**Respostas:**

| Status | Situação | Exemplo |
|--------|----------|---------|
| `201` | Favorito adicionado | `{ "success": true, "message": "Imóvel adicionado aos favoritos!", "data": { ... } }` |
| `400` | ID não fornecido | `{ "success": false, "message": "ID do imóvel não fornecido." }` |
| `401` | Não autenticado | `{ "success": false, "message": "Usuário não autenticado." }` |
| `404` | Imóvel não encontrado | `{ "success": false, "message": "Imóvel não encontrado." }` |
| `409` | Já nos favoritos | `{ "success": false, "message": "Este imóvel já está nos seus favoritos." }` |
| `500` | Erro interno | `{ "success": false, "message": "Erro interno do servidor ao adicionar favorito." }` |

**Fluxo interno:**
1. Verifica se o imóvel existe
2. Verifica se já está nos favoritos (evita duplicidade)
3. Cria o registro de favorito

---

## 📋 Resumo Rápido

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/api/login` | ❌ | Autentica e retorna JWT |
| `POST` | `/api/cadastro` | ❌ | Cria novo usuário |
| `GET` | `/api/imoveis` | ❌ | Lista imóveis com paginação |
| `GET` | `/api/imoveis/:id` | ❌ | Detalhes de um imóvel |
| `GET` | `/api/me` | 🔐 | Dados do usuário logado + reservas |
| `GET` | `/api/get-all-data` | 🔐 | Todas as reservas do banco |
| `POST` | `/api/criar-reserva` | 🔐 | Cria nova reserva |
| `POST` | `/api/confirmar-reserva` | 🔐 | Confirma a reserva |
| `POST` | `/api/listar-reservas` | 🔐 | Lista reservas do usuário |
| `DELETE` | `/api/cancelar-reserva` | 🔐 | Cancela uma reserva |
| `POST` | `/api/adicionar-favorito` | 🔐 | Adiciona imóvel aos favoritos |

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

**Listar Imóveis:**
```bash
curl -X GET "http://localhost:3000/api/imoveis?page=1&limit=16"
```

**Buscar Imóvel por ID:**
```bash
curl -X GET http://localhost:3000/api/imoveis/<ID_DO_IMOVEL>
```

**Criar Reserva (autenticado):**
```bash
curl -X POST http://localhost:3000/api/criar-reserva \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"imoveisId": "<ID>", "chekIn": "2026-06-10", "chekOut": "2026-06-12"}'
```

**Confirmar Reserva (autenticado):**
```bash
curl -X POST http://localhost:3000/api/confirmar-reserva \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"imoveisId": "<ID>", "chekIn": "2026-06-10", "chekOut": "2026-06-12", "finalValue": 300}'
```

**Listar Reservas (autenticado):**
```bash
curl -X POST http://localhost:3000/api/listar-reservas \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
```

**Cancelar Reserva (autenticado):**
```bash
curl -X DELETE http://localhost:3000/api/cancelar-reserva \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"id": "<ID_DA_RESERVA>"}'
```

**Adicionar Favorito (autenticado):**
```bash
curl -X POST http://localhost:3000/api/adicionar-favorito \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{"imoveisId": "<ID_DO_IMOVEL>"}'
```
