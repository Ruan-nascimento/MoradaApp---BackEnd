import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const listarReservasController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const reservas = await prisma.reservas.findMany({
      where: { userId },
      include: {
        imoveis: {
          select: {
            id: true,
            title: true,
            photo: true,
            city: true,
            uf: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: reservas,
    });
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao listar reservas.",
    });
  }
};