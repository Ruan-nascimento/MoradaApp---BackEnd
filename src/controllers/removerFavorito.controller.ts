import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";

export const removerFavoritoController = async (req: AuthRequest, res: Response): Promise<any> => {
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

    const favoritoExistente = await prisma.favoritos.findFirst({
      where: { imoveisId, userId },
    });

    if (!favoritoExistente) {
      return res.status(404).json({
        success: false,
        message: "Este imóvel não está nos seus favoritos.",
      });
    }

    await prisma.favoritos.delete({
      where: { id: favoritoExistente.id },
    });

    return res.status(200).json({
      success: true,
      message: "Imóvel removido dos favoritos com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao remover favorito.",
    });
  }
};
