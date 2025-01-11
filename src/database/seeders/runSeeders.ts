import seedDatabase from './database.seeder';

export async function runSeeders() {
    try {
        console.log('Running seeders...');
        await seedDatabase();
        console.log('Seeders completed successfully');
    } catch (error) {
        console.error('Error running seeders:', error);
        throw error;
    }
}

