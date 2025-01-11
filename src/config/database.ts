import { Sequelize } from 'sequelize-typescript';
import "dotenv/config";
import { Student } from '@/database/models/student.model';
import { User } from '@/database/models/user.model';

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' 
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
