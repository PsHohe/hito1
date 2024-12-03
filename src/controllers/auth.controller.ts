import { Request, Response } from "express";
import authService from "../services/auth.service";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const token = await authService.loginWithEmailAndPassword(email, password);

        res.json({ token });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else res.status(500).json({ error: "Server error" });
    }
};

const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await authService.registerWithEmailAndPassword(email, password);

        res.json({ id: user.id, email: user.email });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else res.status(500).json({ error: "Server error" });
    }
};

export default {
    login,
    register,
};
