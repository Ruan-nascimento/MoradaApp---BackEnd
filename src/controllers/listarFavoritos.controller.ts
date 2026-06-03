import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";

export const listarFavoritosController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const favoritos = await prisma.favoritos.findMany({
      where: { userId },
      include: {
        imoveis: {
          include: {
            reviews: true,
            highlights: true,
            host: true,
          },
        },
      },
    });

    // Mapeia para retornar diretamente a lista de imóveis favoritados com seus dados, filtrando nulos
    const imoveisFavoritos = favoritos
      .map((fav) => fav.imoveis)
      .filter((imovel) => imovel !== null && imovel !== undefined);

    return res.status(200).json({
      success: true,
      data: imoveisFavoritos,
    });
  } catch (error) {
    console.error("Erro ao listar favoritos:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao listar favoritos.",
    });
  }
};
