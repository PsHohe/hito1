import { users } from '@/config/database';
import { User } from '@/interfaces/user.interface';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const getById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
}

const getByEmail = (email: string): User | undefined => {
    return users.find(user => user.email === email);
}

const getAll = (): User[] => {
    return users;
}

const create = (email: string, password: string) => {
    const user: User = {
        id: faker.string.uuid(),
        email,
        hashedPassword: bcrypt.hashSync(password, 10),
    }

    users.push(user);

    return user;
}

export default {
    getById,
    getByEmail,
    getAll,
    create,
};
