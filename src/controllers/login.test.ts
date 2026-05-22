import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { describe, it, expect } from "vitest";
import { app } from "../app";
import { prisma } from "../lib/prisma";
import { makeEmail } from "../utils/makeEmail";
import { createUser } from "../utils/createUserTest";

describe("Login de usuário", () => {
    const rotaLogin = "/api/login";

   

    it("deve fazer login com email e senha válidos", async () => {
        const { email, password } = await createUser();

        const response = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password,
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
    });

    it("deve retornar um token JWT válido com o id do usuário", async () => {
        const { user, email, password } = await createUser();

        const response = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");

        const decoded = jwt.verify(
            response.body.token,
            process.env.JWT_SECRET as string
        ) as {
            id: string;
            iat: number;
            exp: number;
        };

        expect(decoded.id).toBe(user.id);
        expect(decoded.exp).toBeDefined();
        expect(decoded.iat).toBeDefined();
    });

    it("não deve retornar a senha do usuário no login", async () => {
        const { email, password } = await createUser();

        const response = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password,
            });

        expect(response.status).toBe(200);
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("user.password");
    });

    it("deve retornar erro se o email não for enviado", async () => {
        const response = await request(app)
            .post(rotaLogin)
            .send({
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Email e senha são obrigatórios",
            success: false,
        });
    });

    it("deve retornar erro se a senha não for enviada", async () => {
        const email = makeEmail("sem-senha");

        const response = await request(app)
            .post(rotaLogin)
            .send({
                email,
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Email e senha são obrigatórios",
            success: false,
        });
    });

    it("deve retornar erro se email e senha não forem enviados", async () => {
        const response = await request(app)
            .post(rotaLogin)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Email e senha são obrigatórios",
            success: false,
        });
    });

    it("deve retornar erro se o usuário não existir", async () => {
        const response = await request(app)
            .post(rotaLogin)
            .send({
                email: makeEmail("inexistente"),
                password: "123456",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Usuário não encontrado",
            success: false,
        });
    });

    it("deve retornar erro se a senha estiver incorreta", async () => {
        const { email } = await createUser("123456");

        const response = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password: "senha-errada",
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "Credenciais Inválidas",
            success: false,
        });
    });

    it("deve diferenciar senha correta de senha incorreta", async () => {
        const { email, password } = await createUser("123456");

        const wrongPasswordResponse = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password: "senha-errada",
            });

        expect(wrongPasswordResponse.status).toBe(400);
        expect(wrongPasswordResponse.body.success).toBe(false);

        const correctPasswordResponse = await request(app)
            .post(rotaLogin)
            .send({
                email,
                password,
            });

        expect(correctPasswordResponse.status).toBe(200);
        expect(correctPasswordResponse.body.success).toBe(true);
        expect(correctPasswordResponse.body).toHaveProperty("token");
    });
});