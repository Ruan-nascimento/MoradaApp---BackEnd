import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";
import { normalizeCheckDates } from "../utils/normalizeCheckDates";

export const confirmReservationController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { imoveisId, chekIn, chekOut, finalValue, pixCode, pixQrCodeBase64 } = req.body;

    if (!imoveisId || !chekIn || !chekOut || !finalValue) {
      return res.status(400).json({
        success: false,
        message: "Dados insuficientes para confirmar a reserva.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const { checkInDate, checkOutDate } = normalizeCheckDates(chekIn, chekOut);

    const imovel = await prisma.imoveis.findUnique({
      where: { id: imoveisId },
    });

    if (!imovel) {
      return res.status(404).json({
        success: false,
        message: "Imóvel não encontrado.",
      });
    }

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

    const reserva = await prisma.reservas.create({
      data: {
        imoveisId,
        userId,
        chekIn: checkInDate,
        chekOut: checkOutDate,
        finalValue,
        pixCode,
        pixQrCodeBase64,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reserva confirmada com sucesso!",
      data: reserva,
    });
  } catch (error) {
    console.error("Erro ao confirmar reserva:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao confirmar a reserva.",
    });
  }
};
