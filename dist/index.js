import express, { Router } from 'express';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';
import { body, validationResult, param } from 'express-validator';
import dotenv from 'dotenv';

const students = [];
const users = [];

class StudentFactory {
  static create(overrides) {
    const student = {
      id: nanoid(),
      name: faker.person.firstName(),
      lastName1: faker.person.lastName(),
      lastName2: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: "age" }).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"),
      gender: faker.person.sex(),
      ...overrides
    };
    students.push(student);
    return student;
  }
  static createMany(count, overrides) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

const seedStudents = (count) => {
  return StudentFactory.createMany(count);
};

class UserFactory {
  static create(overrides) {
    const user = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
      ...overrides
    };
    users.push(user);
    return user;
  }
  static createMany(count, overrides) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

const seedUsers = () => {
  console.log("seedUsers running");
  return UserFactory.create({
    email: "user@email.com",
    hashedPassword: bcrypt.hashSync("password", 10)
  });
};

const seedDatabase = () => {
  console.log("Seeding database...");
  seedStudents(10);
  seedUsers();
  console.log("Database seeded successfully");
};

const getById$1 = (id) => {
  return users.find((user) => user.id === id);
};
const getByEmail = (email) => {
  return users.find((user) => user.email === email);
};
const getAll$1 = () => {
  return users;
};
const create$1 = (email, password) => {
  const user = {
    id: faker.string.uuid(),
    email,
    hashedPassword: bcrypt.hashSync(password, 10)
  };
  users.push(user);
  return user;
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
  const user = userService.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
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

const getById = (id) => {
  return students.find((student) => student.id === id);
};
const getAll = () => {
  return students;
};
const create = (student) => {
  const id = nanoid();
  const newStudent = { ...student, id };
  students.push(newStudent);
  return newStudent;
};
var StudentModel = {
  getById,
  getAll,
  create
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
var studentService = {
  getAllStudents,
  getStudentById: getStudentById$1,
  createStudent: createStudent$1
};

const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      dateOfBirth: req.body.dateOfBirth
    };
    const student = await studentService.createStudent(studentData);
    res.json({
      ...student,
      dateOfBirth: student.dateOfBirth
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json({
      ...student,
      dateOfBirth: format(new Date(student.dateOfBirth), "dd-MM-yyyy")
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var studentController = { getStudents, createStudent, getStudentById };

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

const router = Router();
router.use(verifyToken);
router.get("/", studentController.getStudents);
router.get("/:id", validateGetStudentById, studentController.getStudentById);
router.post("/", validateCreateStudent, studentController.createStudent);

dotenv.config();
const app = express();
const port = process.env.PORT || 3e3;
console.log(`
**************************************************
Initial Setup
**************************************************`);
seedDatabase();
console.log(students);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", router$1);
app.use("/api/v1/students", router);
app.listen(port, () => {
  console.log(`
**************************************************
Server is running on port ${port}
**************************************************`);
});
