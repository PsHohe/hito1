import dotenv from 'dotenv';
import app from './app';
import { initDatabase } from './config/database';
import { runSeeders } from './database/seeders/runSeeders';

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log(`
**************************************************
Initial Setup
**************************************************`);

        await initDatabase();
        await runSeeders();

        app.listen(port, () => {
            console.log(`
**************************************************
Server is running on port ${port}
**************************************************`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();