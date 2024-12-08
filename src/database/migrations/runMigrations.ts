import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import pool from '@/config/database';

dotenv.config();

const __dirname = path.resolve();

async function runMigrations() {
    try {
        console.log('Running migrations...');

        const sqlPath = path.join(__dirname, '/src/database/migrations/init.sql');
        const sqlContent = await fs.readFile(sqlPath, 'utf-8');

        await pool.query(sqlContent);

        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

runMigrations().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});