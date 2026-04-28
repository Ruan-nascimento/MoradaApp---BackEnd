import { Request, Response } from 'express';

export const helloWorldController = (req: Request, res: Response) => {
  res.json({ message: 'Hello, World! Sua API Express + TypeScript está funcionando perfeitamente! 🚀' });
};
