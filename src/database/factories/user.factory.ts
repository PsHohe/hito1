import { users } from '@/config/database';
import { User } from '../../interfaces/user.interface';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export class UserFactory {
    static create(overrides?: Partial<User>): User {
        const user: User = {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            ...overrides,
        };

        users.push(user);

        return user;
    }

    static createMany(count: number, overrides?: Partial<User>): User[] {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}
