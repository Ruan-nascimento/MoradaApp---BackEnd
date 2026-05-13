import { Request, Response } from "express";

export const createReservationController = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Reserva criada" });
}