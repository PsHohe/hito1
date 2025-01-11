import { IStudent } from '../../interfaces/student.interface';
import { faker } from '@faker-js/faker';
import { Student } from '@/database/models/student.model';

export class StudentFactory {
    static async create(overrides?: Partial<IStudent>): Promise<IStudent> {
        const studentData = {
            name: faker.person.firstName(),
            lastName1: faker.person.lastName(),
            lastName2: faker.person.lastName(),
            dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: 'age' }),
            gender: faker.person.sex(),
            ...overrides,
        };

        const student = await Student.create(studentData);
        return student.toJSON();
    }

    static async createMany(count: number, overrides?: Partial<IStudent>): Promise<IStudent[]> {
        const promises = Array.from({ length: count }, () => this.create(overrides));
        return Promise.all(promises);
    }
}

