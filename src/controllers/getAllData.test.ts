import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";
import { createAuthenticatedUser } from "../utils/createUserTest";

describe("Get All Data Controller", () => {
    const rotaGetAllData = "/api/get-all-data";




    it("deve retornar lista vazia quando não houver reservas", async () => {
        const { token } = await createAuthenticatedUser();

        const response = await request(app)
            .get(rotaGetAllData)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            data: [],
            success: true,
        });
    });

    it("deve retornar todas as reservas cadastradas", async () => {
        const { user, token } = await createAuthenticatedUser();

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

        await prisma.reservas.createMany({
            data: [
                {
                    userId: user.user.id,
                    imoveisId: imovel.id,
                    chekIn: new Date("2026-01-01T14:00:00Z"),
                    chekOut: new Date("2026-01-02T12:00:00Z"),
                    finalValue: 100,
                },
                {
                    userId: user.user.id,
                    imoveisId: imovel.id,
                    chekIn: new Date("2026-01-03T14:00:00Z"),
                    chekOut: new Date("2026-01-04T12:00:00Z"),
                    finalValue: 100,
                },
            ],
        });

        const response = await request(app)
            .get(rotaGetAllData)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);

        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    userId: user.user.id,
                    imoveisId: imovel.id,
                    finalValue: 100,
                }),
                expect.objectContaining({
                    userId: user.user.id,
                    imoveisId: imovel.id,
                    finalValue: 100,
                }),
            ])
        );
    });

    it("deve retornar erro se não enviar token", async () => {
        const response = await request(app).get(rotaGetAllData);

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });

    it("deve retornar erro se enviar token inválido", async () => {
        const response = await request(app)
            .get(rotaGetAllData)
            .set("Authorization", "Bearer token_invalido");

        expect(response.status).not.toBe(200);
        expect(response.body.success).toBe(false);
    });
});