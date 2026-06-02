# Interfaces

Pasta centralizada com todas as interfaces e types do projeto. Toda interface ou type utilizado no código fonte deve estar aqui.

## Organização

| Arquivo | Conteúdo |
|---------|----------|
| `auth.ts` | `TokenPayload`, `AuthRequest`, `LoginProps` |
| `cadastro.ts` | `CadastroControllerProps` |
| `index.ts` | Barrel file — re-exporta tudo para facilitar importações |

## Regras

- Componentes, controllers e middlewares **não criam interfaces soltas** dentro de si — importam desta pasta
- Declarações de módulo (`.d.ts`) ficam na pasta `types/`, não aqui
- Usar PascalCase para nomes de interface
- Agrupar por domínio (auth, cadastro, reservas, etc.)

## Uso

```typescript
import { AuthRequest, LoginProps } from "../interfaces/auth";
// ou via barrel:
import { AuthRequest, LoginProps } from "../interfaces";
```
