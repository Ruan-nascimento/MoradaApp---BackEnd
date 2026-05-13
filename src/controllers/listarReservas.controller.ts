import { Request, Response } from "express";

export const listarReservasController = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Reservas listadas com sucesso" });
}