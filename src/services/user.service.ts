import { User } from "@/database/models/user.model";

const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
    return users;
};

const getUserByEmail = async (email: string) => {
    const user = await User.findOne({
        where: { email },
        rejectOnEmpty: false
    });
    return user;
};

const getUserById = async (id: string) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    return user;
};

const createUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const hashedPassword = await User.hashPassword(password);
        
        const user = await User.create({
            email,
            password: hashedPassword
        });
        
        return user.toJSON();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export default {
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUserWithEmailAndPassword,
};
