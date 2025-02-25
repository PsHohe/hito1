import express from 'express';
import authRoute from './routes/auth.route';
import studentRoute from './routes/student.route';
import swaggerUi from "swagger-ui-express";
import openapiSpecification from "./config/swagger";
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logging middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 100, // Límite de 100 peticiones por IP
    message:
        "Demasiadas solicitudes desde esta IP, por favor inténtalo más tarde.",
    standardHeaders: true, // Informa el límite en las cabeceras `RateLimit-*`
    legacyHeaders: false, // Desactiva las cabeceras `X-RateLimit-*`
});

app.use(limiter);

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/students", studentRoute);

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;