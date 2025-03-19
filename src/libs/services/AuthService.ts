import { Secret, JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken';
import { hash, genSalt, compare } from 'bcryptjs';

class AuthService
{
    public async hashPassword (password: string): Promise<string>
    {
        const salt: string = await genSalt(10);
        const hashPassword: string = await hash(password, salt);

        return hashPassword;
    }

    public async comparePassword (password: string, hashedPassword: string): Promise<boolean>
    {
        return await compare(password, hashedPassword);
    }

    public generateToken (payload: object, secretKey: Secret, options?: SignOptions): string
    {
        return sign(payload, secretKey, options)
    }

    public verifyToken (token: string, secretKey: Secret): string | JwtPayload | unknown
    {
        try {
            return verify(token, secretKey);
        } catch (err) {
            throw new Error(`failed to verify token: invalid or expired token.`);
        }
    }
}