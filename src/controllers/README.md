# Controllers

A pasta `controllers` é responsável por receber as requisições HTTP (Request) e retornar as respostas (Response).

## Convenções

- Nomenclatura: `<ação>.controller.ts` (ex: `login.controller.ts`, `cadastro.controller.ts`)
- Cada controller exporta uma única função assíncrona
- Toda interação com o Prisma é protegida por `try/catch`
- Erros inesperados retornam `500` com mensagem genérica

## Controllers Existentes

| Arquivo | Rota | Descrição |
|---------|------|-----------|
| `login.controller.ts` | `POST /login` | Autenticação de usuário via email/senha |
| `cadastro.controller.ts` | `POST /cadastro` | Criação de novo usuário |
| `me.controller.ts` | `GET /me` | Dados do usuário autenticado |
| `getAllData.controller.ts` | `GET /get-all-data` | Todas as reservas do banco |
| `createReservation.controller.ts` | `POST /criar-reserva` | Criação de reserva |
| `confirmReservation.controller.ts` | `POST /confirmar-reserva` | Simulação de pagamento + confirmação |
| `listarReservas.controller.ts` | `POST /listar-reservas` | Reservas do usuário |
| `cancelarReserva.controller.ts` | `DELETE /cancelar-reserva` | Cancelamento de reserva |
| `adicionarFavorito.controller.ts` | `POST /adicionar-favorito` | Adicionar imóvel aos favoritos |
| `listImoveis.controller.ts` | `GET /imoveis` | Listagem paginada de imóveis |
| `getImovelById.controller.ts` | `GET /imoveis/:id` | Detalhes de um imóvel |

## Regras

- Controllers não contêm regra de negócio complexa
- Validação de input é feita no próprio controller ou via utils
- Interfaces importadas de `../interfaces`
- Funções utilitárias importadas de `../utils`
