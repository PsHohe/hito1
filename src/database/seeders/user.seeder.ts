import { User } from "@/interfaces/user.interface";
import { UserFactory } from "@/database/factories/user.factory";
import bcrypt from 'bcryptjs';

export const seedUsers = async (): Promise<User> => {
    console.log('Creating user with email: user@email.com and password: password');
    return UserFactory.create({
        email: 'user@email.com',
        password: bcrypt.hashSync('password', 10),
    });
};

export default seedUsers;