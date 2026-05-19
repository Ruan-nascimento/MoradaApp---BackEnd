import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginProps {
    email: string
    password: string
}

export const loginController = async (req: Request, res: Response) => {

    const { email, password } = req.body as LoginProps;

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Email e senha são obrigatórios",
                success: false
            });
        }

        const user = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Usuário não encontrado",
                success: false
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Credenciais Inválidas",
                success: false
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
            token,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro desconhecido ao fazer login. Tente Novamente!",
            success: false
        });
    }


}