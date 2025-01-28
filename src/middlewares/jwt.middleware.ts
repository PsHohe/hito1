import { environment } from "@/config/environment";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json("No Bearer Token");
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, environment.jwtSecret) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

export default verifyToken;