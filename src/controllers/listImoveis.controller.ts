import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listImoveisController = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 16;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: any = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { uf: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [imoveis, total] = await Promise.all([
      prisma.imoveis.findMany({
        where,
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
      prisma.imoveis.count({ where })
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
