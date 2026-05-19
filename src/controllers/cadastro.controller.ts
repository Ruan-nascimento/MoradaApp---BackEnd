import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { validateEmail, validateName, validatePassword } from "../utils/validateUserCadastro";

interface CadastroControllerProps {
    email: string;
    password: string;
    name: string;
}

export const cadastroController = async (req: Request, res: Response) => {

    const { email, password, name } = req.body as CadastroControllerProps;

    try {

        if (!validateEmail(email) || !email) {
            return res.status(400).json({
                message: "Email inválido. Exemplo: morada@gmail.com",
                success: false
            });
        }

        if (!validatePassword(password) || !password) {
            return res.status(400).json({
                message: "Senha inválida. Tente uma senha com 6 caracteres ou mais.",
                success: false
            });
        }

        if (!validateName(name) || !name) {
            return res.status(400).json({
                message: "Nome inválido. Tente um nome com 3 caracteres ou mais.",
                success: false
            });
        }

        const userExists = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if (userExists) {
            return res.status(400).json({
                message: "Usuário já existe, Faça Login",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                name: name.trim().toLowerCase()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Erro ao cadastrar usuário. Tente Novamente!",
                success: false
            });
        }

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro desconhecido ao cadastrar usuário. Tente Novamente!",
            success: false
        });
    }


}