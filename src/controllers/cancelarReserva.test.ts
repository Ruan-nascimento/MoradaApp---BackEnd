import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Cancel Reservation Controller", () => {
    const rotaCancelarReserva = "/api/cancelar-reserva";

    it("deve cancelar uma reserva própria com sucesso pelo body", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.cancel@email.com",
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

        const reserva = await prisma.reservas.create({
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
            .delete(rotaCancelarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({ id: reserva.id });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Reserva cancelada com sucesso.");

        const deletedReserva = await prisma.reservas.findUnique({
            where: { id: reserva.id },
        });
        expect(deletedReserva).toBeNull();
    });

    it("deve retornar erro se a reserva não for do usuário", async () => {
        const userOwner = await prisma.usuario.create({
            data: {
                name: "Dono da Reserva",
                email: "owner.cancel@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const otherUser = await prisma.usuario.create({
            data: {
                name: "Outro Usuário",
                email: "other.cancel@email.com",
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

        const reserva = await prisma.reservas.create({
            data: {
                imoveisId: imovel.id,
                userId: userOwner.id,
                chekIn: new Date("2026-07-01T14:00:00.000Z"),
                chekOut: new Date("2026-07-05T12:00:00.000Z"),
                finalValue: 600,
            },
        });

        const token = createToken(otherUser.id);

        const response = await request(app)
            .delete(rotaCancelarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({ id: reserva.id });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Você não tem permissão para cancelar esta reserva.");
    });

    it("deve retornar erro se a reserva não existir", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.cancel3@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .delete(rotaCancelarReserva)
            .set("Authorization", `Bearer ${token}`)
            .send({ id: "id-inexistente" });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Reserva não encontrada.");
    });
});
