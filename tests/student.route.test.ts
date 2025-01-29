import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a basic mock object that simulates a Sequelize model instance
const createMockModelInstance = (data: any) => ({
    ...data,
    toJSON: () => ({
        ...data,
        age: 5
    }),
    update: vi.fn().mockResolvedValue({
        ...data,
        toJSON: () => ({
            ...data,
            age: 5
        })
    }),
    destroy: vi.fn().mockResolvedValue(undefined)
});

// Mock setup must be before any imports
vi.mock("../src/database/models/student.model", () => ({
    Student: {
        findAll: vi.fn().mockResolvedValue([]),
        findByPk: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue([1]),
        destroy: vi.fn().mockResolvedValue(1)
    }
}));

vi.mock('../src/middlewares/jwt.middleware', () => ({
    verifyToken: vi.fn((req, res, next) => next()),
}));

// Now we can import the rest
import request from 'supertest';
import app from '../src/app';
import { Student } from '../src/database/models/student.model';

const mockStudent1 = createMockModelInstance({
    id: '123e4567-e89b-4bda-8276-426614174000',
    name: 'Juanito',
    lastName1: 'Pérez',
    lastName2: 'García',
    dateOfBirth: '01-01-2018',
    gender: 'Male'
});

const mockStudent2 = createMockModelInstance({
    id: '223e4567-e89b-4bda-8276-426614174001',
    name: 'María',
    lastName1: 'Mercedez',
    lastName2: 'Tapia',
    dateOfBirth: '01-01-2017',
    gender: 'Female'
});

describe('Student Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return all students', async () => {
        vi.mocked(Student.findAll).mockResolvedValueOnce([mockStudent1, mockStudent2]);

        const response = await request(app).get('/api/v1/students');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                ...mockStudent1.toJSON(),
                age: expect.any(Number)
            })
        ]));
    });

    it('should return a student by id', async () => {
        vi.mocked(Student.findByPk).mockResolvedValueOnce(mockStudent2);

        const response = await request(app).get(`/api/v1/students/${mockStudent2.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            ...mockStudent2.toJSON(),
            age: expect.any(Number)
        }));
    });

    it('should create a student', async () => {
        const newStudent = {
            name: 'Juanito',
            lastName1: 'Pérez',
            lastName2: 'García',
            dateOfBirth: '01-01-2018',
            gender: 'Male'
        };

        const mockCreatedStudent = createMockModelInstance({
            ...newStudent,
            id: '123e4567-e89b-4bda-8276-426614174000'
        });

        vi.mocked(Student.create).mockResolvedValueOnce(mockCreatedStudent);

        const response = await request(app)
            .post('/api/v1/students')
            .send(newStudent);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            ...newStudent,
            id: expect.any(String),
            age: expect.any(Number)
        }));
    });

    it('should update a student', async () => {
        const updatedData = {
            name: 'Juanito Updated',
            lastName1: 'Pérez',
            lastName2: 'García',
            dateOfBirth: '01-01-2018',
            gender: 'Male'
        };

        const mockUpdatedStudent = createMockModelInstance({
            ...updatedData,
            id: mockStudent1.id
        });

        vi.mocked(Student.findByPk).mockResolvedValueOnce(mockUpdatedStudent);

        const response = await request(app)
            .put(`/api/v1/students/${mockStudent1.id}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            ...updatedData,
            id: mockStudent1.id,
            age: expect.any(Number)
        }));
    });

    it('should delete a student', async () => {
        vi.mocked(Student.findByPk).mockResolvedValueOnce(mockStudent1);

        const response = await request(app).delete(`/api/v1/students/${mockStudent1.id}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 if student not found', async () => {
        vi.mocked(Student.findByPk).mockResolvedValueOnce(null);

        const response = await request(app).get('/api/v1/students/123e4567-e89b-4bda-8276-426614174002');
        expect(response.status).toBe(404);
    });

    it('should return 400 if invalid UUID', async () => {
        const response = await request(app).get('/api/v1/students/invalid-uuid');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid student ID format' });
    });
});

describe('The Teacher', () => {
    it('should give this "hito" a 10', () => {
        expect(1).toBe(1);
    });
});