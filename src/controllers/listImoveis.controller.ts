import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listImoveisController = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 16;
    const skip = (page - 1) * limit;

    const [imoveis, total] = await Promise.all([
      prisma.imoveis.findMany({
        skip: skip,
        take: limit,
        include: {
          host: {
            select: { id: true, name: true, photo: true }
          },
          reviews: {
            select: { stars: true }
          }
        },
        orderBy: [
          { createdAt: "desc" },
          { id: "asc" }
        ]
      }),
      prisma.imoveis.count()
    ]);

    return res.status(200).json({
      data: imoveis,
      total,
      page,
      limit,
      hasNextPage: skip + imoveis.length < total
    });
  } catch (error) {
    console.error("Erro ao listar imóveis:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar os imóveis"
    });
  }
};
