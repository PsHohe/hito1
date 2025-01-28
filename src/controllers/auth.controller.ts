import { Request, Response } from "express";
import authService from "../services/auth.service";
import userService from "@/services/user.service";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const token = await authService.loginWithEmailAndPassword(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 1 * 60 * 60 * 1000, // 1 hora
        });

        res.json({ message: "You're now authenticated!"})
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

const logout = async (_: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.json({ message: "You've been correctly logged out!" });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
}

const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ email: user.email });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
}

export default {
    login,
    register,
    logout,
    me,
};
