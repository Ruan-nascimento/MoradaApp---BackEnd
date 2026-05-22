import {prisma} from "../src/lib/prisma"
import { beforeAll, afterAll, beforeEach } from "vitest";


beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.usuario.deleteMany();
  await prisma.reservas.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});