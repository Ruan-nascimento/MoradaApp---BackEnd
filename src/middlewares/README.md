# Middlewares

A pasta `middlewares` armazena funções que interceptam as requisições antes de chegarem aos controllers.

**Regras:**
- Use middlewares para verificar autenticação e autorização (ex: verificar token JWT).
- Útil para formatação e validação de dados de entrada (ex: Joi ou Zod).
- Utilizado também para tratamento centralizado de erros ou controle de acessos (CORS, Rate Limit).
