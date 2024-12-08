import { User } from '../../interfaces/user.interface';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import pool from '@/config/database';

export class UserFactory {
    static async create(overrides?: Partial<User>): Promise<User> {
        const password = faker.internet.password();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: Omit<User, 'id'> = {
            email: faker.internet.email(),
            password: hashedPassword,
            ...overrides,
        };

        const query = `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await pool.query(query, [user.email, user.password]);
        return result.rows[0];
    }

    static async createMany(count: number, overrides?: Partial<User>): Promise<User[]> {
        const promises = Array.from({ length: count }, () => this.create(overrides));
        return Promise.all(promises);
    }
}
