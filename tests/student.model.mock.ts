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

const createSequelizeModelMock = (data: any) => ({
    ...data,
    toJSON: () => ({
        ...data,
        age: 5 // Mock age calculation
    })
});

export const studentModelMock = () => ({
    Student: {
        findAll: vi.fn(async () => mockStudents.map(student => 
            createSequelizeModelMock({
                ...student,
                dateOfBirth: new Date(student.dateOfBirth.split('-').reverse().join('-'))
            })
        )),
        findByPk: vi.fn(async (id: string) => {
            const student = mockStudents.find(student => student.id === id);
            if (student) {
                return createSequelizeModelMock({
                    ...student,
                    dateOfBirth: new Date(student.dateOfBirth.split('-').reverse().join('-'))
                });
            }
            return null;
        }),
        create: vi.fn(async (data: any) => 
            createSequelizeModelMock({
                ...data,
                id: '123e4567-e89b-12d3-a456-426614174000'
            })
        ),
        update: vi.fn(async (data: any) => [1]),
        destroy: vi.fn(async () => 1)
    }
});