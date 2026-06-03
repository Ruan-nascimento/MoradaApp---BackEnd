import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("Remove Favorite Controller", () => {
    const rotaRemoverFavorito = "/api/remover-favorito";

    it("deve remover um imóvel dos favoritos com sucesso", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.rem@email.com",
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
            .delete(rotaRemoverFavorito)
            .set("Authorization", `Bearer ${token}`)
            .send({ imoveisId: imovel.id });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Imóvel removido dos favoritos com sucesso.");

        // Verifica se realmente removeu do banco
        const favorito = await prisma.favoritos.findFirst({
            where: { imoveisId: imovel.id, userId: user.id },
        });
        expect(favorito).toBeNull();
    });

    it("deve retornar erro se tentar remover um imóvel que não está nos favoritos", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.rem2@email.com",
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
            .delete(rotaRemoverFavorito)
            .set("Authorization", `Bearer ${token}`)
            .send({ imoveisId: imovel.id });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Este imóvel não está nos seus favoritos.");
    });
});
