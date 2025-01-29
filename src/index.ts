import app from './app';
import { initDatabase } from './config/database';
import { runSeeders } from './database/seeders/runSeeders';
import { environment } from './config/environment';

const port = environment.port;

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