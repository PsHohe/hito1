import express from 'express';
import authRoute from './routes/auth.route';
import studentRoute from './routes/student.route';
import swaggerUi from "swagger-ui-express";
import openapiSpecification from "./config/swagger";
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export default app;