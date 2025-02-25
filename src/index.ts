import app from './app';
import { createServer } from 'http';
import { initDatabase } from './config/database';
import { runSeeders } from './database/seeders/runSeeders';
import { environment } from './config/environment';
import { initializeSocket } from './config/socket';

const port = environment.port;

const startServer = async () => {
    try {
        console.log(`
**************************************************
Initial Setup
**************************************************`);

        await initDatabase();
        await runSeeders();

        const httpServer = createServer(app);
        const io = initializeSocket(httpServer);

        httpServer.listen(port, () => {
            console.log(`
**************************************************
Server is running on port ${port}
Socket.IO server initialized
**************************************************`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();