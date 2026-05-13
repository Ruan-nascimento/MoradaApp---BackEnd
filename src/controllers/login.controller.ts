import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginController = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(400).json({
            message: "Usuário não encontrado"
        });
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        return res.status(400).json({
            message: "Credenciais Inválidas"
        });
    }

    const token = jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d"
        }
    );

    return res.json({
        token
    });
}