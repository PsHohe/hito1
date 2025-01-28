import { Router } from "express";
import authController from "@/controllers/auth.controller";
import verifyToken from "@/middlewares/jwt.middleware";

const router = Router();

// path: http:localhost:3000/api/v1/auth

// Login
router.post("/login", authController.login);

// Register
router.post("/register", authController.register);

// Logout
router.post("/logout", authController.logout)

// Get own user data
router.get("/me", verifyToken, authController.me)

export default router;
