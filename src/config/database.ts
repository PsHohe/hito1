import { Sequelize } from 'sequelize-typescript';
import { Student } from '@/database/models/student.model';
import { User } from '@/database/models/user.model';
import { environment } from './environment';

const sequelize = new Sequelize(environment.databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: environment.nodeEnv === 'production'
            ? {
                require: true,
                rejectUnauthorized: false
            }
            : false
    },
    logging: false
});

export const initDatabase = async () => {
    try {
        sequelize.addModels([Student, User]);
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL Database');

        // Drop and recreate all tables
        await sequelize.sync({ force: true });
        console.log('Database synchronized - All tables have been recreated');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

export default sequelize;
