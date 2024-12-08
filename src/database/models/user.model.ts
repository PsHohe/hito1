import pool from '@/config/database';
import { User } from '@/interfaces/user.interface';
import bcrypt from 'bcryptjs';

const getById = async (id: string): Promise<User | undefined> => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getByEmail = async (email: string): Promise<User | undefined> => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

const getAll = async (): Promise<User[]> => {
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    return result.rows;
};

const create = async (email: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING *
    `;
    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
};

export default {
    getById,
    getByEmail,
    getAll,
    create,
};
