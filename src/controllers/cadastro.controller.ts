import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const cadastroController = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userExists) {
        return res.status(400).json({
            message: "Usuário já existe"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    return res.status(201).json(user);
}