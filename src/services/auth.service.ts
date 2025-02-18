import jwt from "jsonwebtoken";
import userService from "./user.service";
import { environment } from "@/config/environment";

const loginWithEmailAndPassword = async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, environment.jwtSecret, { expiresIn: '1h' });
    return token;
};

const registerWithEmailAndPassword = async (email: string, password: string) => {
    const user = await userService.createUserWithEmailAndPassword(email, password);
    return user;
};

export default {
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
};
