import { Request, Response } from "express";

export const getAllDataController = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Dados obtidos com sucesso" });
}