import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Iniciado. Rodando na porta ${PORT}`);
  // Prisma Client Types Reloaded & JSON limit increased to 10mb
});