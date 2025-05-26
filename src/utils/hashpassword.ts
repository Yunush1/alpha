import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};


export const generateToken = async (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = async (token: string) : Promise<any> => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const decodeToken = async (token: string) : Promise<any> => {
    return jwt.decode(token);
};
