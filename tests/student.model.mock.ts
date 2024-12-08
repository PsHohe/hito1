import { IStudent } from "../src/interfaces/student.interface";
import { toDbNames } from "../src/utils/toDbName";
import { vi } from "vitest";

export const mockStudent1 = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Juanito',
    lastName1: 'Pérez',
    lastName2: 'García',
    dateOfBirth: '01-01-2018',
    gender: 'Male'
};

export const mockStudent2 = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'María',
    lastName1: 'Mercedez',
    lastName2: 'Tapia',
    dateOfBirth: '01-01-2017',
    gender: 'Female'
}

export const mockStudents = [mockStudent1, mockStudent2];

export const studentModelMock = () => {
    return {
        default: {
            getAll: vi.fn(async () => mockStudents.map(student => toDbNames({
                ...student,
                dateOfBirth: new Date(student.dateOfBirth)
            }))),
            getById: vi.fn(async (id: string) => {
                const student = mockStudents.find(student => student.id === id);
                if (student) {
                    return toDbNames({
                        ...student,
                        dateOfBirth: new Date(student.dateOfBirth)
                    });
                }
                return undefined;
            }),
            create: vi.fn(async (student: IStudent) => {
                return toDbNames({
                    ...student,
                    dateOfBirth: new Date(student.dateOfBirth)
                });
            }),
            updateById: vi.fn(async (id: string, student: IStudent) => {
                return toDbNames({
                    ...student,
                    dateOfBirth: new Date(student.dateOfBirth)
                });
            }),
            deleteById: vi.fn()
        }
    };
}