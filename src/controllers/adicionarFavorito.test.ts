import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Add Favorite Controller", () => {
    const rotaAdicionarFavorito = "/api/adicionar-favorito";

    it("deve adicionar um imóvel aos favoritos com sucesso", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.fav@email.com",
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
            .post(rotaAdicionarFavorito)
            .set("Authorization", `Bearer ${token}`)
            .send({ imoveisId: imovel.id });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Imóvel adicionado aos favoritos!");
        expect(response.body.data).toBeDefined();
    });

    it("deve retornar erro se o imóvel já estiver nos favoritos", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.fav2@email.com",
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

        await prisma.favoritos.create({
            data: {
                imoveisId: imovel.id,
                userId: user.id,
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaAdicionarFavorito)
            .set("Authorization", `Bearer ${token}`)
            .send({ imoveisId: imovel.id });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Este imóvel já está nos seus favoritos.");
    });

    it("deve retornar erro se o imóvel não existir", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.fav3@email.com",
                password: await bcrypt.hash("123456", 10),
            },
        });

        const token = createToken(user.id);

        const response = await request(app)
            .post(rotaAdicionarFavorito)
            .set("Authorization", `Bearer ${token}`)
            .send({ imoveisId: "id-inexistente" });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Imóvel não encontrado.");
    });
});
