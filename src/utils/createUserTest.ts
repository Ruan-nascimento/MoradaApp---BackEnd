import { prisma } from "../lib/prisma";
import { createToken } from "./createToken";
import { makeEmail } from "./makeEmail";
import bcrypt from "bcrypt";

 export async function createUser(password = "123456") {
        const email = makeEmail("login");

        const user = await prisma.usuario.create({
            data: {
                name: "ruan carlos",
                email,
                password: await bcrypt.hash(password, 10),
            },
        });

        return {
            user,
            email,
            password,
        };
    }

export async function createAuthenticatedUser() {
        const user = await createUser();
        const token = createToken(user.user.id);

        return {
            user,
            token,
        };
    }