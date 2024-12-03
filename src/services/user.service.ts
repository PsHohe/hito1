import UserModel from "@/database/models/user.model";

const getAllUsers = () => {
    const users = UserModel.getAll();
    return users;
};

const getUserByEmail = (email: string) => {
    const user = UserModel.getByEmail(email);
    return user;
};

const createUserWithEmailAndPassword = (email: string, password: string) => {
    const user = UserModel.create(email, password);
    return user;
};

export default {
    getAllUsers,
    getUserByEmail,
    createUserWithEmailAndPassword,
};
