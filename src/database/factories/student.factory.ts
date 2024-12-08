import { IStudent } from '../../interfaces/student.interface';
import { faker } from '@faker-js/faker';
import pool from '@/config/database';

export class StudentFactory {
    static async create(overrides?: Partial<IStudent>): Promise<IStudent> {
        const student: Omit<IStudent, 'id'> = {
            name: faker.person.firstName(),
            lastName1: faker.person.lastName(),
            lastName2: faker.person.lastName(),
            dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: 'age' }),
            gender: faker.person.sex(),
            ...overrides,
        };

        const query = `
            INSERT INTO students (name, lastName1, lastName2, dateOfBirth, gender)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            student.name,
            student.lastName1,
            student.lastName2,
            student.dateOfBirth,
            student.gender
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async createMany(count: number, overrides?: Partial<IStudent>): Promise<IStudent[]> {
        const promises = Array.from({ length: count }, () => this.create(overrides));
        return Promise.all(promises);
    }
}

