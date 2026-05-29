import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Me Controller", () => {
    const rotaMe = "/api/me";

    beforeEach(async () => {
        await prisma.reservas.deleteMany();
        await prisma.favoritos.deleteMany();
        await prisma.reviews.deleteMany();
        await prisma.highlights.deleteMany();
        await prisma.imoveis.deleteMany();
        await prisma.host.deleteMany();
        await prisma.usuario.deleteMany();
    });

    it("deve retornar os dados do usuário autenticado", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "ruan carlos",
                email: "ruan@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.user).toEqual(
            expect.objectContaining({
                id: user.id,
                name: "ruan carlos",
                email: "ruan@email.com",
            })
        );

        expect(response.body.user).toHaveProperty("reservas");
        expect(Array.isArray(response.body.user.reservas)).toBe(true);
    });

    it("não deve retornar a senha do usuário", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "ruan carlos",
                email: "ruan@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.user).not.toHaveProperty("password");
    });

    it("deve retornar as reservas do usuário", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "ruan carlos",
                email: "ruan@email.com",
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
                price: 100,
                hostId: host.id,
            },
        });

        await prisma.reservas.create({
            data: {
                userId: user.id,
                imoveisId: imovel.id,
                chekIn: new Date("2026-01-01T14:00:00Z"),
                chekOut: new Date("2026-01-02T12:00:00Z"),
                finalValue: 100,
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.reservas).toHaveLength(1);
    });

    it("deve retornar erro se o usuário do token não existir mais", async () => {
        const fakeUserId = "user_id_inexistente";
        const token = createToken(fakeUserId);

        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Usuário não encontrado",
            success: false,
        });
    });

    it("deve retornar erro se não enviar token", async () => {
        const response = await request(app).get(rotaMe);

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });

    it("deve retornar erro se enviar token inválido", async () => {
        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", "Bearer token_invalido");

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });

    it("deve retornar erro se enviar Authorization mal formatado", async () => {
        const response = await request(app)
            .get(rotaMe)
            .set("Authorization", "token_sem_bearer");

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });
});