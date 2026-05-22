import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllDataController = async (req: Request, res: Response) => {
    try {
        const allData = await prisma.reservas.findMany();

        return res.status(200).json({
            data: allData,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar dados",
            success: false,
        });
    }
};