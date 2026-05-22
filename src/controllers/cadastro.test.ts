import request from "supertest";
import bcrypt from "bcrypt";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { makeEmail } from "../utils/makeEmail";

describe("Cadastro de usuário", () => {
    const rotaCadastro = "/api/cadastro";

    it("deve cadastrar um usuário com dados válidos", async () => {
        const email = makeEmail("cadastro");

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email,
                password: "123456",
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "Usuário cadastrado com sucesso!",
            success: true,
        });

        const user = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        expect(user).not.toBeNull();
        expect(user?.email).toBe(email);
        expect(user?.name).toBe("ruan carlos");
    });

    it("deve salvar a senha criptografada no banco", async () => {
        const email = makeEmail("senha");

        await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email,
                password: "123456",
            });

        const user = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        expect(user).not.toBeNull();
        expect(user?.password).not.toBe("123456");

        const passwordIsValid = await bcrypt.compare(
            "123456",
            user?.password as string
        );

        expect(passwordIsValid).toBe(true);
    });

    it("deve retornar erro se o email for inválido", async () => {
        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email: "email-invalido",
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Email inválido. Exemplo: morada@gmail.com",
            success: false,
        });
    });

    it("deve retornar erro se o email não for enviado", async () => {
        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Email inválido. Exemplo: morada@gmail.com",
            success: false,
        });
    });

    it("deve retornar erro se a senha for inválida", async () => {
        const email = makeEmail("senha-invalida");

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email,
                password: "123",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Senha inválida. Tente uma senha com 6 caracteres ou mais.",
            success: false,
        });
    });

    it("deve retornar erro se a senha não for enviada", async () => {
        const email = makeEmail("sem-senha");

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email,
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Senha inválida. Tente uma senha com 6 caracteres ou mais.",
            success: false,
        });
    });

    it("deve retornar erro se o nome for inválido", async () => {
        const email = makeEmail("nome-invalido");

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ru",
                email,
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Nome inválido. Tente um nome com 3 caracteres ou mais.",
            success: false,
        });
    });

    it("deve retornar erro se o nome não for enviado", async () => {
        const email = makeEmail("sem-nome");

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                email,
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Nome inválido. Tente um nome com 3 caracteres ou mais.",
            success: false,
        });
    });

    it("deve impedir cadastro com email já existente", async () => {
        const email = makeEmail("duplicado");

        await prisma.usuario.create({
            data: {
                name: "ruan carlos",
                email,
                password: await bcrypt.hash("123456", 10),
            },
        });

        const response = await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ruan Carlos",
                email,
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Usuário já existe, Faça Login",
            success: false,
        });
    });

    it("não deve criar usuário quando os dados forem inválidos", async () => {
        const email = makeEmail("dados-invalidos");

        await request(app)
            .post(rotaCadastro)
            .send({
                name: "Ru",
                email,
                password: "123456",
            });

        const user = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        expect(user).toBeNull();
    });
});