import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("List Reservations Controller", () => {
    const rotaListarReservas = "/api/listar-reservas";

    it("deve listar as reservas do usuário com sucesso", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.listar@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const host = await prisma.host.create({
            data: {
                name: "Host Teste",
                photo: "https://example.com/host.jpg",
            },
        });

        const imovel = await prisma.imoveis.create({
            data: {
                title: "Imóvel Teste",
                photo: "https://example.com/imovel.jpg",
                uf: "PE",
                city: "Recife",
                price: 150,
                hostId: host.id,
            },
        });

        await prisma.reservas.create({
            data: {
                imoveisId: imovel.id,
                userId: user.id,
                chekIn: new Date("2026-07-01T14:00:00.000Z"),
                chekOut: new Date("2026-07-05T12:00:00.000Z"),
                finalValue: 600,
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaListarReservas)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].imoveis.title).toBe("Imóvel Teste");
    });

    it("deve retornar lista vazia se o usuário não possuir reservas", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.listar2@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaListarReservas)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
    });
});
