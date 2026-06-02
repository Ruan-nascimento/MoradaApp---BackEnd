# Utils

Funções utilitárias reutilizáveis do projeto. Lógica que se repete ou que pode ser extraída de controllers fica aqui.

## Utilitários Disponíveis

| Arquivo | Função | Descrição |
|---------|--------|-----------|
| `validateUserCadastro.ts` | `validateEmail`, `validatePassword`, `validateName` | Validações de input no cadastro |
| `calculateNights.ts` | `calculateNights` | Calcula quantidade de diárias entre check-in e check-out |
| `normalizeCheckDates.ts` | `normalizeCheckDates` | Normaliza datas de check-in/check-out para 12h |
| `createToken.ts` | `createToken` | Gera token JWT para testes |
| `createUserTest.ts` | `createUser`, `createAuthenticatedUser` | Helpers para criação de usuário nos testes |
| `makeEmail.ts` | `makeEmail` | Gera emails únicos para testes |

## Regras

- Funções devem ser puras quando possível (sem side effects)
- Nomenclatura: `camelCase` para funções, arquivo com nome descritivo
- Helpers exclusivos de teste (`createUserTest`, `makeEmail`, `createToken`) podem ser movidos para `tests/` futuramente
