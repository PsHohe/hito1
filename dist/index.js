import dotenv from 'dotenv';
import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import pg from 'pg';
import { differenceInYears, format } from 'date-fns';
import { body, validationResult, param } from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';

const { Pool } = pg;
console.log(process.env.DATABASE_URL, "connection string");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  if (!client) {
    return console.error("Client is undefined");
  }
  client.query("SELECT NOW()", (err2, result) => {
    release();
    if (err2) {
      return console.error("Error executing query", err2.stack);
    }
    console.log("Connected to PostgreSQL Database");
  });
});

const getById$1 = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
const getByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};
const getAll$1 = async () => {
  const query = "SELECT * FROM users";
  const result = await pool.query(query);
  return result.rows;
};
const create$1 = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING *
    `;
  const result = await pool.query(query, [email, hashedPassword]);
  return result.rows[0];
};
var UserModel = {
  getById: getById$1,
  getByEmail,
  getAll: getAll$1,
  create: create$1
};

const getAllUsers = () => {
  const users = UserModel.getAll();
  return users;
};
const getUserByEmail = (email) => {
  const user = UserModel.getByEmail(email);
  return user;
};
const createUserWithEmailAndPassword = (email, password) => {
  const user = UserModel.create(email, password);
  return user;
};
var userService = {
  getAllUsers,
  getUserByEmail,
  createUserWithEmailAndPassword
};

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  return token;
};
const registerWithEmailAndPassword = async (email, password) => {
  const user = await userService.createUserWithEmailAndPassword(email, password);
  return user;
};
var authService = {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginWithEmailAndPassword(email, password);
    res.json({ token });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else res.status(500).json({ error: "Server error" });
  }
};
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerWithEmailAndPassword(email, password);
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else res.status(500).json({ error: "Server error" });
  }
};
var authController = {
  login,
  register
};

const router$1 = Router();
router$1.post("/login", authController.login);
router$1.post("/register", authController.register);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json("No Bearer Token");
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

const getById = async (id) => {
  const query = "SELECT * FROM students WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
const getAll = async () => {
  const query = "SELECT * FROM students";
  const result = await pool.query(query);
  return result.rows;
};
const create = async (student) => {
  const query = `
        INSERT INTO students (name, lastName1, lastName2, dateOfBirth, gender)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
  const values = [
    student.name,
    student.lastName1,
    student.lastName2,
    student.dateOfBirth,
    student.gender
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const updateById = async (id, student) => {
  const query = `
        UPDATE students 
        SET name = $1, lastName1 = $2, lastName2 = $3, dateOfBirth = $4, gender = $5 
        WHERE id = $6
        RETURNING *
    `;
  const values = [student.name, student.lastName1, student.lastName2, student.dateOfBirth, student.gender, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const deleteById = async (id) => {
  const query = "DELETE FROM students WHERE id = $1";
  await pool.query(query, [id]);
};
const StudentModel = {
  getById,
  getAll,
  create,
  updateById,
  deleteById
};

const getAllStudents = () => {
  const students = StudentModel.getAll();
  return students;
};
const getStudentById$1 = (id) => {
  const student = StudentModel.getById(id);
  return student;
};
const createStudent$1 = (student) => {
  const newStudent = StudentModel.create(student);
  return newStudent;
};
const updateStudent$1 = (id, student) => {
  const updatedStudent = StudentModel.updateById(id, student);
  return updatedStudent;
};
const deleteStudent$1 = async (id) => {
  const deleted = await StudentModel.deleteById(id);
  return deleted;
};
var studentService = {
  getAllStudents,
  getStudentById: getStudentById$1,
  createStudent: createStudent$1,
  updateStudent: updateStudent$1,
  deleteStudent: deleteStudent$1
};

class Student {
  id;
  name;
  lastName1;
  lastName2;
  dateOfBirth;
  gender;
  constructor(data) {
    if (data.id) this.id = data.id;
    this.name = data.name;
    this.lastName1 = data.lastName1;
    this.lastName2 = data.lastName2;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
  }
  static fromJson(json) {
    return new Student({
      id: json.id,
      name: json.name,
      lastName1: json.lastname1,
      lastName2: json.lastname2,
      dateOfBirth: new Date(json.dateofbirth),
      gender: json.gender
    });
  }
  get age() {
    return differenceInYears(/* @__PURE__ */ new Date(), this.dateOfBirth);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      lastName1: this.lastName1,
      lastName2: this.lastName2,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender
    };
  }
}

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students.map((student) => {
      const studentObj = Student.fromJson(student);
      return {
        ...studentObj,
        dateOfBirth: format(new Date(studentObj.dateOfBirth), "dd-MM-yyyy")
      };
    }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      dateOfBirth: new Date(req.body.dateOfBirth)
    };
    const studentRaw = await studentService.createStudent(studentData);
    const student = Student.fromJson(studentRaw);
    res.status(201).json({
      ...student,
      dateOfBirth: format(new Date(student.dateOfBirth), "dd-MM-yyyy")
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentById = async (req, res) => {
  try {
    const studentRaw = await studentService.getStudentById(req.params.id);
    if (!studentRaw) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    const student = Student.fromJson(studentRaw);
    res.json({
      ...student,
      dateOfBirth: format(new Date(student.dateOfBirth), "dd-MM-yyyy")
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      dateOfBirth: new Date(req.body.dateOfBirth)
    };
    const studentRaw = await studentService.updateStudent(req.params.id, studentData);
    const student = Student.fromJson({ ...studentRaw, id: req.params.id });
    res.status(200).json({
      ...student,
      dateOfBirth: format(new Date(student.dateOfBirth), "dd-MM-yyyy")
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var studentController = { getStudents, createStudent, getStudentById, updateStudent, deleteStudent };

const validateCreateStudent = [
  body("name").isString().notEmpty(),
  body("lastName1").isString().notEmpty(),
  body("lastName2").isString().notEmpty(),
  body("dateOfBirth").isDate({ format: "DD-MM-YYYY" }),
  body("gender").isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
const validateGetStudentById = [
  param("id").isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
const validateUpdateStudent = [
  ...validateCreateStudent,
  (req, res, next) => {
    req.body.id = req.params.id;
    next();
  }
];

const router = Router();
router.use(verifyToken);
router.get("/", studentController.getStudents);
router.get("/:id", validateGetStudentById, studentController.getStudentById);
router.post("/", validateCreateStudent, studentController.createStudent);
router.put("/:id", validateUpdateStudent, studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST Students",
      version: "1.0.0",
      description: "Documentation for api rest"
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1"
        // URL base de la API
      }
    ]
  },
  apis: ["swagger/student.swagger.yml", "swagger/auth.swagger.yml"]
};
const openapiSpecification = swaggerJsdoc(options);

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
  windowMs: 5 * 60 * 1e3,
  // 5 minutos
  max: 100,
  // Límite de 100 peticiones por IP
  message: "Demasiadas solicitudes desde esta IP, por favor int\xE9ntalo m\xE1s tarde.",
  standardHeaders: true,
  // Informa el límite en las cabeceras `RateLimit-*`
  legacyHeaders: false
  // Desactiva las cabeceras `X-RateLimit-*`
});
app.use(limiter);
app.use("/api/v1/auth", router$1);
app.use("/api/v1/students", router);

dotenv.config();
const port = process.env.PORT || 3e3;
const startServer = async () => {
  try {
    console.log(`
**************************************************
Initial Setup
**************************************************`);
    app.listen(port, () => {
      console.log(`
**************************************************
Server is running on port ${port}
**************************************************`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
