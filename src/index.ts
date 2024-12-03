import express from 'express';
import seedDatabase from './database/seeders/database.seeder';
import authRoute from './routes/auth.route';
import studentRoute from './routes/student.route';
import dotenv from 'dotenv';
import { students } from './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log(`
**************************************************
Initial Setup
**************************************************`);

// Alimentamos la base de datos con datos de prueba
seedDatabase();
console.log(students);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/students", studentRoute);

// Server
app.listen(port, () => {
    console.log(`
**************************************************
Server is running on port ${port}
**************************************************`);
});