import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Create Reservation Controller", () => {
    const rotaCriarReserva = "/api/criar-reserva";

    it("deve criar uma reserva com sucesso", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.reserva@email.com",
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

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaCriarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: imovel.id,
                chekIn: "2026-07-01T14:00:00.000Z",
                chekOut: "2026-07-05T12:00:00.000Z",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Reserva criada com sucesso!");
        expect(response.body.data).toBeDefined();
        // 4 diárias: 4 * 150 = 600
        expect(response.body.data.finalValue).toBe(600);
    });

    it("deve retornar erro se os dados estiverem incompletos", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.reserva2@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaCriarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: "algum-id",
                chekIn: "2026-07-01T14:00:00.000Z",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Dados incompletos para criar reserva.");
    });

    it("deve retornar erro se o imóvel não existir", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.reserva3@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaCriarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: "id-inexistente",
                chekIn: "2026-07-01T14:00:00.000Z",
                chekOut: "2026-07-05T12:00:00.000Z",
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Imóvel não encontrado.");
    });

    it("deve retornar erro se houver conflito de datas", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.reserva4@email.com",
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

        // Reserva existente: de 01/07 a 05/07
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

        // Tentativa de reserva conflitante: de 03/07 a 07/07
        const response = await request(app)
            .post(rotaCriarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: imovel.id,
                chekIn: "2026-07-03T14:00:00.000Z",
                chekOut: "2026-07-07T12:00:00.000Z",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Este imóvel já está reservado no período selecionado.");
    });

    it("deve retornar erro de autenticação se não enviar token", async () => {
        const response = await request(app)
            .post(rotaCriarReserva)
            .send({
                imoveisId: "algum-id",
                chekIn: "2026-07-01T14:00:00.000Z",
                chekOut: "2026-07-05T12:00:00.000Z",
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
