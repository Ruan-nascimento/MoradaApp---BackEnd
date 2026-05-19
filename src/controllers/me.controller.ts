import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const meController = async (req: AuthRequest, res: Response) => {

    try {

        const user = await prisma.usuario.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                reservas: true
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Usuário não encontrado",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro desconhecido ao buscar usuário. Tente Novamente!",
            success: false
        });
    }


}