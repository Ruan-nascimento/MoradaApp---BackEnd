import { abacate } from "../lib/abacatepay";
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const confirmReservationController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { imoveisId, chekIn, chekOut, finalValue, abacatePayId, pixCode, pixQrCodeBase64 } = req.body;

    if (!imoveisId || !chekIn || !chekOut || !finalValue || !abacatePayId) {
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

    const checkInDate = new Date(chekIn);
    const checkOutDate = new Date(chekOut);
    checkInDate.setHours(12, 0, 0, 0);
    checkOutDate.setHours(12, 0, 0, 0);

    // 1. Validar conflito de datas novamente para evitar double-booking
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
        message: "Este imóvel já foi reservado por outro usuário para esse período.",
      });
    }

    try {
      // 2. Simular pagamento no gateway Abacate Pay usando o SDK oficial
      const resData = await abacate.pix.simulate(abacatePayId);

      if (resData && resData.id) {
        // 3. Criar de fato a reserva no banco de dados
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
          message: "Pagamento simulado com sucesso e reserva confirmada!",
          data: reserva,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Falha ao simular pagamento com o gateway (resposta vazia).",
        });
      }
    } catch (apiError: any) {
      console.error("Erro ao simular pagamento:", apiError);
      return res.status(400).json({
        success: false,
        message: "Erro na simulação do pagamento: " + (apiError.message || apiError),
      });
    }
  } catch (error) {
    console.error("Erro ao confirmar reserva:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao confirmar a reserva.",
    });
  }
};
