import {prisma} from "../src/lib/prisma"
import { beforeAll, afterAll, beforeEach } from "vitest";


beforeAll(async () => {
  await prisma.$connect();
});


beforeEach(async () => {
    await prisma.reservas.deleteMany();
    await prisma.favoritos.deleteMany();
    await prisma.reviews.deleteMany();
    await prisma.highlights.deleteMany();
    await prisma.imoveis.deleteMany();
    await prisma.host.deleteMany();
    await prisma.usuario.deleteMany();
});


afterAll(async () => {
  await prisma.$disconnect();
});