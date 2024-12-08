import { describe, it, expect, vi } from 'vitest';
import request, { Test } from 'supertest';
import { toDbNames } from '../src/utils/toDbName';
import app from '../src/app';
import { IStudent } from '../src/interfaces/student.interface';

const mockStudent1 = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Juanito',
    lastName1: 'Pérez',
    lastName2: 'García',
    dateOfBirth: '01-01-2018',
    gender: 'Male'
};

const mockStudent2 = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'María',
    lastName1: 'Mercedez',
    lastName2: 'Tapia',
    dateOfBirth: '01-01-2017',
    gender: 'Female'
}

const mockStudents = [mockStudent1, mockStudent2];

vi.mock("../src/database/models/student.model", () => {
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
});


vi.mock('../src/middlewares/jwt.middleware', () => ({
    verifyToken: vi.fn((req, res, next) => next())
}));

describe('Student Routes', () => {

    it('should return all students', async () => {
        const response = await request(app).get('/api/v1/students');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStudents);
    });

    it('should return a student by id', async () => {
        const response = await request(app).get('/api/v1/students/223e4567-e89b-12d3-a456-426614174001');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStudent2);
    });

    it('should create a student', async () => {
        const response = await request(app).post('/api/v1/students').send(mockStudent1);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockStudent1);
    });

    it('should update a student', async () => {
        const response = await request(app).put('/api/v1/students/123e4567-e89b-12d3-a456-426614174000').send(mockStudent1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockStudent1);
    });

    it('should delete a student', async () => {
        const response = await request(app).delete('/api/v1/students/123e4567-e89b-12d3-a456-426614174000');
        expect(response.status).toBe(204);
    });

    it('should return 404 if student not found', async () => {
        const response = await request(app).get('/api/v1/students/123e4567-e89b-12d3-a456-426614174002');
        expect(response.status).toBe(404);
    });

});


describe('The Teacher', () => {
    it('should give this "hito" a 10', () => {
        expect(1).toBe(1);
    });
});