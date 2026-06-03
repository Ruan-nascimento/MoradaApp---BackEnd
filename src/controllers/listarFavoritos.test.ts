import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { createToken } from "../utils/createToken";

describe("List Favorites Controller", () => {
    const rotaListarFavoritos = "/api/favoritos";

    it("deve retornar uma lista com os imóveis favoritos do usuário", async () => {
        const user = await prisma.usuario.create({
            data: {
                name: "Ruan Carlos",
                email: "ruan.lst@email.com",
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
                title: "Imóvel Teste Favorito",
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
            .get(rotaListarFavoritos)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].id).toBe(imovel.id);
        expect(response.body.data[0].title).toBe("Imóvel Teste Favorito");
    });
});
