import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const cancelarReservaController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const { id } = req.body;
    const queryId = req.query.id as string;
    const reservaId = id || queryId;

    if (!reservaId) {
      return res.status(400).json({
        success: false,
        message: "ID da reserva não fornecido.",
      });
    }

    // Buscar reserva para verificar se pertence ao usuário
    const reserva = await prisma.reservas.findUnique({
      where: { id: reservaId },
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva não encontrada.",
      });
    }

    if (reserva.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Você não tem permissão para cancelar esta reserva.",
      });
    }

    await prisma.reservas.delete({
      where: { id: reservaId },
    });

    return res.status(200).json({
      success: true,
      message: "Reserva cancelada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao cancelar reserva.",
    });
  }
};