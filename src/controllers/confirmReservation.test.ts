import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Confirm Reservation Controller", () => {
    const rotaConfirmarReserva = "/api/confirmar-reserva";

    it("deve confirmar uma reserva com sucesso", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.confirm@email.com",
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
            .post(rotaConfirmarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: imovel.id,
                chekIn: "2026-07-01T14:00:00.000Z",
                chekOut: "2026-07-05T12:00:00.000Z",
                finalValue: 600,
                pixCode: "pix-code-123",
                pixQrCodeBase64: "base64-image-data",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Reserva confirmada com sucesso!");
        expect(response.body.data).toBeDefined();
        expect(response.body.data.pixCode).toBe("pix-code-123");
    });

    it("deve retornar erro se os dados forem insuficientes", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.confirm2@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaConfirmarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: "algum-id",
                chekIn: "2026-07-01T14:00:00.000Z",
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Dados insuficientes para confirmar a reserva.");
    });

    it("deve retornar erro se houver conflito de datas", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.confirm3@email.com",
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

        // Reserva existente no período
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
            .post(rotaConfirmarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({
                imoveisId: imovel.id,
                chekIn: "2026-07-03T14:00:00.000Z",
                chekOut: "2026-07-07T12:00:00.000Z",
                finalValue: 600,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Este imóvel já foi reservado por outro usuário para esse período.");
    });
});
