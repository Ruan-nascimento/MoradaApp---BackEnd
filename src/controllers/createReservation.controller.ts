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

    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const finalValue = imovel.price * nights;

    // Criar a reserva no banco de dados temporariamente
    const reserva = await prisma.reservas.create({
      data: {
        imoveisId,
        userId,
        chekIn: checkInDate,
        chekOut: checkOutDate,
        finalValue,
      },
    });

    // Chamar API da Abacate Pay
    const abacatePayKey = process.env.ABACATE_PAY_KEY;
    const finalValueInCents = finalValue * 100;

    let pixCode = "";
    let pixQrCodeBase64 = "";

    try {
      const response = await fetch("https://api.abacatepay.com/v2/transparents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${abacatePayKey}`,
        },
        body: JSON.stringify({
          method: "PIX",
          data: {
            amount: finalValueInCents,
            description: `Reserva do imovel: ${imovel.title}`,
            expiresIn: 3600,
            externalId: reserva.id,
            customer: {
              name: user.name,
              email: user.email,
              taxId: "12345678909", // cpf ficticio exigido
              cellphone: "11999999999",
            },
          },
        }),
      });

      const resData = await response.json() as any;

      if (response.ok && resData.success && resData.data) {
        pixCode = resData.data.brCode;
        pixQrCodeBase64 = resData.data.brCodeBase64;

        // Atualizar reserva com os códigos do PIX
        await prisma.reservas.update({
          where: { id: reserva.id },
          data: {
            pixCode,
            pixQrCodeBase64,
          },
        });
      } else {
        console.error("Erro ao chamar Abacate Pay:", resData);
      }
    } catch (apiError) {
      console.error("Erro na API da Abacate Pay:", apiError);
    }

    return res.status(201).json({
      success: true,
      message: "Reserva criada com sucesso!",
      data: {
        reservaId: reserva.id,
        chekIn: checkInDate,
        chekOut: checkOutDate,
        finalValue,
        pixCode,
        pixQrCodeBase64,
      },
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar reserva.",
    });
  }
};