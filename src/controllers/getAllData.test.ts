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

        await prisma.reservas.createMany({
            data: [
                {
                    hora: "19:00",
                    nome: "Reserva Teste 1",
                    userId: user.user.id,
                    data: new Date("2026-01-01").toISOString(),
                },
                {
                    hora: "20:00",
                    nome: "Reserva Teste 2",
                    userId: user.user.id,
                    data: new Date("2026-01-02").toISOString(),
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
                    nome: "Reserva Teste 1",
                    hora: "19:00",
                    userId: user.user.id,
                }),
                expect.objectContaining({
                    nome: "Reserva Teste 2",
                    hora: "20:00",
                    userId: user.user.id,
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