import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";

describe("Imoveis Controllers", () => {
    describe("GET /api/imoveis", () => {
        it("deve listar imóveis com paginação padrão", async () => {
            const host = await prisma.host.create({
                data: {
                    name: "Host Teste",
                    photo: "https://example.com/host.jpg",
                },
            });

            await prisma.imoveis.create({
                data: {
                    title: "Imóvel 1",
                    photo: "https://example.com/imovel1.jpg",
                    uf: "PE",
                    city: "Recife",
                    price: 100,
                    hostId: host.id,
                },
            });

            const response = await request(app).get("/api/imoveis");

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.total).toBe(1);
            expect(response.body.page).toBe(1);
            expect(response.body.limit).toBe(16);
            expect(response.body.hasNextPage).toBe(false);
        });
    });

    describe("GET /api/imoveis/:id", () => {
        it("deve retornar detalhes do imóvel pelo id", async () => {
            const host = await prisma.host.create({
                data: {
                    name: "Host Teste",
                    photo: "https://example.com/host.jpg",
                },
            });

            const imovel = await prisma.imoveis.create({
                data: {
                    title: "Imóvel 1",
                    photo: "https://example.com/imovel1.jpg",
                    uf: "PE",
                    city: "Recife",
                    price: 100,
                    hostId: host.id,
                },
            });

            const response = await request(app).get(`/api/imoveis/${imovel.id}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe("Imóvel 1");
            expect(response.body.data.host.name).toBe("Host Teste");
        });

        it("deve retornar 404 se o imóvel não for encontrado", async () => {
            const response = await request(app).get("/api/imoveis/id-inexistente");

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Imóvel não encontrado");
        });
    });
});
