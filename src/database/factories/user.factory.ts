import { User as IUser } from '../../interfaces/user.interface';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { User } from '@/database/models/user.model';

export class UserFactory {
    static async create(overrides?: Partial<IUser>): Promise<IUser> {
        const password = faker.internet.password();
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            email: faker.internet.email(),
            password: hashedPassword,
            ...overrides,
        };

        const user = await User.create(userData);
        return user.toJSON();
    }

    static async createMany(count: number, overrides?: Partial<IUser>): Promise<IUser[]> {
        const promises = Array.from({ length: count }, () => this.create(overrides));
        return Promise.all(promises);
    }
}
