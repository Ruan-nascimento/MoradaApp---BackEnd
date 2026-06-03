import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";
import { normalizeCheckDates } from "../utils/normalizeCheckDates";
import { calculateNights } from "../utils/calculateNights";

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

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado.",
      });
    }

    const imovel = await prisma.imoveis.findUnique({
      where: { id: imoveisId },
    });

    if (!imovel) {
      return res.status(404).json({
        success: false,
        message: "Imóvel não encontrado.",
      });
    }

    const { checkInDate, checkOutDate } = normalizeCheckDates(chekIn, chekOut);

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
        message: `Não será possível reservar o ${imovel.title} no dia selecionado.`,
      });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const finalValue = imovel.price * nights;

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