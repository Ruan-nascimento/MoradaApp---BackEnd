# Services

A pasta `services` concentra a **Lógica e Regras de Negócio** da aplicação.

**Regras:**
- Os serviços não devem saber que estão em uma API (sem Request ou Response).
- Um serviço deve realizar as validações de negócio, cálculos ou comunicações complexas.
- É aqui que chamamos o banco de dados (geralmente através de repositórios ou usando o ORM diretamente em projetos mais simples) e APIs externas.
