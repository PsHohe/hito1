import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        jwt.verify(token, process.env.JWT_SECRET || 'secret');
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

export default verifyToken;