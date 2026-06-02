# Lib

Instâncias de serviços externos e conexões compartilhadas do projeto.

## Arquivos

| Arquivo | Exportação | Descrição |
|---------|-----------|-----------|
| `prisma.ts` | `prisma` | Instância do PrismaClient com adapter PostgreSQL |

## Regras

- Cada lib exporta uma **única instância** compartilhada
- Configuração via variáveis de ambiente (`.env`)
- Não importar `dotenv` em controllers — a lib já cuida disso
