import jwt from "jsonwebtoken";

    export function createToken(userId: string) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
    }