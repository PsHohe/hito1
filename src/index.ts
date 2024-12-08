import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log(`
**************************************************
Initial Setup
**************************************************`);

        // Start server
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