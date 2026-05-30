import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getImovelByIdController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params as { id: string | undefined };

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do imóvel não fornecido",
      });
    }

    const imovel = await prisma.imoveis.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            photo: true,
            createdAt: true,
          },
        },
        highlights: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          select: {
            id: true,
            name: true,
            imgUser: true,
            stars: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!imovel) {
      return res.status(404).json({
        success: false,
        message: "Imóvel não encontrado",
      });
    }

    return res.status(200).json({
      data: imovel,
      success: true,
    });
  } catch (error) {
    console.error("Erro ao buscar imóvel por ID:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar o imóvel",
    });
  }
};
