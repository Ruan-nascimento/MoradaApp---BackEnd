import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../interfaces/auth";

export const updatePhotoController = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem foi enviada.",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado.",
      });
    }

    const user = await prisma.usuario.update({
      where: { id: userId },
      data: { photo },
    });

    return res.status(200).json({
      success: true,
      message: "Foto de perfil atualizada com sucesso!",
      photo: user.photo,
    });
  } catch (error) {
    console.error("Erro ao atualizar foto de perfil:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar a foto de perfil.",
    });
  }
};
