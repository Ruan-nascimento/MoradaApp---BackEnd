import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const createReservationController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { imoveisId, chekIn, chekOut } = req.body;

    if (!imoveisId || !chekIn || !chekOut) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos para criar reserva.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    // Buscar usuário
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    // Buscar imóvel
    const imovel = await prisma.imoveis.findUnique({
      where: { id: imoveisId },
    });

    if (!imovel) {
      return res.status(404).json({
        success: false,
        message: "Imóvel não encontrado.",
      });
    }

    // Processar datas às 12:00
    const checkInDate = new Date(chekIn);
    const checkOutDate = new Date(chekOut);
    checkInDate.setHours(12, 0, 0, 0);
    checkOutDate.setHours(12, 0, 0, 0);

    // Validação de colisão de datas
    const conflito = await prisma.reservas.findFirst({
      where: {
        imoveisId,
        chekIn: {
          lt: checkOutDate,
        },
        chekOut: {
          gt: checkInDate,
        },
      },
    });

    if (conflito) {
      return res.status(400).json({
        success: false,
        message: "Este imóvel já está reservado no período selecionado.",
      });
    }

    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const finalValue = imovel.price * nights;

    // Criar a reserva de fato no banco de dados
    const reserva = await prisma.reservas.create({
      data: {
        imoveisId,
        userId,
        chekIn: checkInDate,
        chekOut: checkOutDate,
        finalValue,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reserva criada com sucesso!",
      data: reserva,
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar reserva.",
    });
  }
};