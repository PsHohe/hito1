import pool from '@/config/database';
import { IStudent } from '@/interfaces/student.interface';

const getById = async (id: string): Promise<IStudent | undefined> => {
    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getAll = async (): Promise<IStudent[]> => {
    const query = 'SELECT * FROM students';
    const result = await pool.query(query);
    return result.rows;
};

const create = async (student: Omit<IStudent, 'id'>): Promise<IStudent> => {
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
};

const updateById = async (id: string, student: IStudent): Promise<IStudent> => {
    const query = `
        UPDATE students 
        SET name = $1, lastName1 = $2, lastName2 = $3, dateOfBirth = $4, gender = $5 
        WHERE id = $6
        RETURNING *
    `;
    const values = [student.name, student.lastName1, student.lastName2, student.dateOfBirth, student.gender, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteById = async (id: string): Promise<void> => {
    const query = 'DELETE FROM students WHERE id = $1';
    await pool.query(query, [id]);
};

export default {
    getById,
    getAll,
    create,
    updateById,
    deleteById
};
