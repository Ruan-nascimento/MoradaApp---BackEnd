import { Request } from "express";

export interface TokenPayload {
    id: string;
}

export interface AuthRequest extends Request {
    userId?: string;
}

export interface LoginProps {
    email: string;
    password: string;
}
