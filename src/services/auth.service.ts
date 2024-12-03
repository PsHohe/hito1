import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userService from "./user.service";

const loginWithEmailAndPassword = async (email: string, password: string) => {
    const user = userService.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
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