import seedDatabase from './database.seeder';
import pool from '@/config/database';

async function runSeeders() {
    try {
        console.log('Running seeders...');
        await seedDatabase();
        console.log('Seeders completed successfully');
    } catch (error) {
        console.error('Error running seeders:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

runSeeders().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
}); 