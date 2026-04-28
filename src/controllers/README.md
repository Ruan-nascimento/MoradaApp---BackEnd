# Controllers

A pasta `controllers` é responsável por receber as requisições HTTP (Request) e retornar as respostas (Response).

**Regras:**
- Os controllers não devem conter regra de negócio complexa.
- Eles apenas processam a entrada, chamam a camada de **Services** para a lógica, e retornam a resposta ao usuário.
- Mantenha os controllers enxutos e organizados por domínio (ex: `user.controller.ts`, `product.controller.ts`).
