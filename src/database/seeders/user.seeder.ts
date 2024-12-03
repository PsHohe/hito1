import { User } from "@/interfaces/user.interface";
import { UserFactory } from "@/database/factories/user.factory";
import bcrypt from 'bcryptjs';

export const seedUsers = (): User => {
    console.log('seedUsers running');
    return UserFactory.create({
        email: 'user@email.com',
        hashedPassword: bcrypt.hashSync('password', 10),
    });
};


export default seedUsers;