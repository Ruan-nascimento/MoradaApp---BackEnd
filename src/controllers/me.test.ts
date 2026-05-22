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

        await prisma.reservas.create({
            data: {
                hora: "19:00",
                nome: "Reserva Teste",
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: user.id,
                data: new Date("2024-12-31").toISOString()

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