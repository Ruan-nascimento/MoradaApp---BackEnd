import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export const meController = async (req: AuthRequest, res: Response) => {

    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.userId)
        }
    });

    return res.json(user);
}