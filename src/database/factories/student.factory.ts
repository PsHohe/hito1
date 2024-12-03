import { students } from '@/config/database';
import { Student } from '../../interfaces/student.interface';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

export class StudentFactory {
    static create(overrides?: Partial<Student>): Student {
        const student: Student = {
            id: nanoid(),
            name: faker.person.firstName(),
            lastName1: faker.person.lastName(),
            lastName2: faker.person.lastName(),
            dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: 'age' }).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            gender: faker.person.sex(),
            ...overrides,
        };

        students.push(student);

        return student;
    }

    static createMany(count: number, overrides?: Partial<Student>): Student[] {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}

