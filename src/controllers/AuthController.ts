import { Request, Response } from "express";
import { prisma } from "../db/connection";
import { User } from "../validators/userValidator";
import { hash, genSalt } from "bcryptjs";

class AuthController
{
    public async register (req: Request, res: Response) {
        const payloadUser = req.body;

        try {
            let validated = User.parse(payloadUser);

            const hashPassword = await hash(validated.password, await genSalt(10));
            
            const newUser = await prisma.user.create({
                data: {
                    first_name: validated.first_name,
                    last_name: validated.last_name,
                    email: validated.email,
                    password: hashPassword,
                    role_id: validated.role_id,
                },
            });

            return res.status(201).json({
                status: true,
                message: 'user successfully registered.',
                data: newUser,

            })
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: `failed to register new user: ${err instanceof Error ? err.message : err}`,
            });
        }
    }
}

export default new AuthController;