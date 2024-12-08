import { Router } from "express";
import { verifyToken } from "@/middlewares/jwt.middleware";
import studentController from "@/controllers/student.controller";
import { validateCreateStudent, validateGetStudentById, validateUpdateStudent } from "@/middlewares/studentValidation.middleware";

const router = Router();

// path: http:localhost:3000/api/v1/students

// Proteger las rutas
router.use(verifyToken)

// Listar estudiantes
router.get("/", studentController.getStudents);

// Listar un estudiante por id
router.get("/:id", validateGetStudentById, studentController.getStudentById);

// Crear un estudiante
router.post("/", validateCreateStudent, studentController.createStudent);

// Actualizar un estudiante
router.put("/:id", validateUpdateStudent, studentController.updateStudent);

// Eliminar un estudiante
router.delete("/:id", studentController.deleteStudent);

export default router;
