import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";

export const adicionarFavoritoController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const { imoveisId } = req.body;

    if (!imoveisId) {
      return res.status(400).json({
        success: false,
        message: "ID do imóvel não fornecido.",
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

    const favoritoExistente = await prisma.favoritos.findFirst({
      where: { imoveisId, userId },
    });

    if (favoritoExistente) {
      return res.status(409).json({
        success: false,
        message: "Este imóvel já está nos seus favoritos.",
      });
    }

    const favorito = await prisma.favoritos.create({
      data: {
        imoveisId,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Imóvel adicionado aos favoritos!",
      data: favorito,
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao adicionar favorito.",
    });
  }
};
