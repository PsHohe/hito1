import "dotenv/config";

export const environment = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || ''
};


if (!environment.databaseUrl || environment.databaseUrl === '') {
    throw new Error('DATABASE_URL is not set');
}

if (!environment.jwtSecret || environment.jwtSecret === '') {
    throw new Error('JWT_SECRET is not set');
}

if (environment.jwtSecret.length < 10) {
    throw new Error('JWT_SECRET is too short');
}