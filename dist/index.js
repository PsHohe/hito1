import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Column, DataType, Table, Model, Sequelize } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { differenceInYears } from 'date-fns';
import { body, validationResult, param } from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let User = class extends Model {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
  async comparePassword(candidatePassword) {
    try {
      if (!this.password || !candidatePassword) {
        return false;
      }
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (error) {
      return false;
    }
  }
  toJSON() {
    const values = super.toJSON();
    delete values.password;
    return values;
  }
};
__decorateClass$1([
  Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
], User.prototype, "id", 2);
__decorateClass$1([
  Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  })
], User.prototype, "email", 2);
__decorateClass$1([
  Column({
    type: DataType.TEXT,
    allowNull: false
  })
], User.prototype, "password", 2);
User = __decorateClass$1([
  Table({
    tableName: "users",
    timestamps: false
  })
], User);

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  });
  return users;
};
const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    rejectOnEmpty: false
  });
  return user;
};
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] }
  });
  return user;
};
const createUserWithEmailAndPassword = async (email, password) => {
  try {
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword
    });
    return user.toJSON();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
var userService = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUserWithEmailAndPassword
};

const environment = {
  port: process.env.PORT || 3e3,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || ""
};
if (!environment.databaseUrl || environment.databaseUrl === "") {
  throw new Error("DATABASE_URL is not set");
}
if (!environment.jwtSecret || environment.jwtSecret === "") {
  throw new Error("JWT_SECRET is not set");
}
if (environment.jwtSecret.length < 10) {
  throw new Error("JWT_SECRET is too short");
}

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ id: user.id }, environment.jwtSecret, { expiresIn: "1h" });
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 1 * 60 * 60 * 1e3
      // 1 hora
    });
    res.json({ message: "You're now authenticated!" });
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
const logout = async (_, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "You've been correctly logged out!" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
const me = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ email: user.email });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};
var authController = {
  login,
  register,
  logout,
  me
};

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json("Authentication required");
    return;
  }
  try {
    const decoded = jwt.verify(token, environment.jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

const router$1 = Router();
router$1.post("/login", authController.login);
router$1.post("/register", authController.register);
router$1.post("/logout", authController.logout);
router$1.get("/me", verifyToken, authController.me);

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let Student = class extends Model {
  get age() {
    if (!this.dateOfBirth) return null;
    return differenceInYears(/* @__PURE__ */ new Date(), this.dateOfBirth);
  }
  toJSON() {
    const values = super.toJSON();
    return {
      ...values,
      age: this.age
    };
  }
};
__decorateClass([
  Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
], Student.prototype, "id", 2);
__decorateClass([
  Column({
    type: DataType.STRING,
    allowNull: false
  })
], Student.prototype, "name", 2);
__decorateClass([
  Column({
    type: DataType.STRING,
    allowNull: false,
    field: "lastName1"
  })
], Student.prototype, "lastName1", 2);
__decorateClass([
  Column({
    type: DataType.STRING,
    allowNull: false,
    field: "lastName2"
  })
], Student.prototype, "lastName2", 2);
__decorateClass([
  Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "dateOfBirth",
    get() {
      const value = this.getDataValue("dateOfBirth");
      return value ? new Date(value) : null;
    }
  })
], Student.prototype, "dateOfBirth", 2);
__decorateClass([
  Column({
    type: DataType.STRING,
    allowNull: false
  })
], Student.prototype, "gender", 2);
Student = __decorateClass([
  Table({
    tableName: "students",
    timestamps: false
  })
], Student);

const getAllStudents = async () => {
  const students = await Student.findAll();
  return students;
};
const getStudentById$1 = async (id) => {
  const student = await Student.findByPk(id);
  return student;
};
const createStudent$1 = async (studentData) => {
  const student = await Student.create(studentData);
  return student;
};
const updateStudent$1 = async (id, studentData) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw new Error("Student not found");
  }
  const updatedStudent = await student.update(studentData);
  return updatedStudent;
};
const deleteStudent$1 = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw new Error("Student not found");
  }
  await student.destroy();
};
var studentService = {
  getAllStudents,
  getStudentById: getStudentById$1,
  createStudent: createStudent$1,
  updateStudent: updateStudent$1,
  deleteStudent: deleteStudent$1
};

const formatDate = (date) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    const offset = dateObj.getTimezoneOffset();
    const adjustedDate = new Date(dateObj.getTime() - offset * 60 * 1e3);
    return adjustedDate.toISOString().split("T")[0].split("-").reverse().join("-");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
const getStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students.map((student) => ({
      ...student.toJSON(),
      dateOfBirth: formatDate(student.dateOfBirth)
    })));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createStudent = async (req, res) => {
  try {
    const dateOfBirth = parseDate(req.body.dateOfBirth);
    const studentData = {
      ...req.body,
      dateOfBirth
    };
    const student = await studentService.createStudent(studentData);
    res.status(201).json({
      ...student.toJSON(),
      dateOfBirth: formatDate(student.dateOfBirth)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateUUID(id)) {
      res.status(400).json({ error: "Invalid student ID format" });
      return;
    }
    const student = await studentService.getStudentById(id);
    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json({
      ...student.toJSON(),
      dateOfBirth: formatDate(student.dateOfBirth)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateUUID(id)) {
      res.status(400).json({ error: "Invalid student ID format" });
      return;
    }
    const dateOfBirth = parseDate(req.body.dateOfBirth);
    const studentData = {
      ...req.body,
      dateOfBirth
    };
    const student = await studentService.updateStudent(id, studentData);
    res.json({
      ...student.toJSON(),
      dateOfBirth: formatDate(student.dateOfBirth)
    });
  } catch (error) {
    if (error?.message === "Student not found") {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateUUID(id)) {
      res.status(400).json({ error: "Invalid student ID format" });
      return;
    }
    await studentService.deleteStudent(id);
    res.status(204).send();
  } catch (error) {
    if (error?.message === "Student not found") {
      res.status(404).json({ error: "Student not found" });
      return;
    }
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
app.use(cookieParser());
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

const sequelize = new Sequelize(environment.databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: environment.nodeEnv === "production" ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false
});
const initDatabase = async () => {
  try {
    sequelize.addModels([Student, User]);
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL Database");
    await sequelize.sync({ force: true });
    console.log("Database synchronized - All tables have been recreated");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

class StudentFactory {
  static async create(overrides) {
    const studentData = {
      name: faker.person.firstName(),
      lastName1: faker.person.lastName(),
      lastName2: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: "age" }),
      gender: faker.person.sex(),
      ...overrides
    };
    const student = await Student.create(studentData);
    return student.toJSON();
  }
  static async createMany(count, overrides) {
    const promises = Array.from({ length: count }, () => this.create(overrides));
    return Promise.all(promises);
  }
}

const seedStudents = async (count) => {
  return StudentFactory.createMany(count);
};

class UserFactory {
  static async create(overrides) {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email: faker.internet.email(),
      password: hashedPassword,
      ...overrides
    };
    const user = await User.create(userData);
    return user.toJSON();
  }
  static async createMany(count, overrides) {
    const promises = Array.from({ length: count }, () => this.create(overrides));
    return Promise.all(promises);
  }
}

const seedUsers = async () => {
  console.log("Creating user with email: user@email.com and password: password");
  return UserFactory.create({
    email: "user@email.com",
    password: bcrypt.hashSync("password", 10)
  });
};

const seedDatabase = async () => {
  console.log("Seeding database...");
  try {
    await seedStudents(10);
    await seedUsers();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

async function runSeeders() {
  try {
    console.log("Running seeders...");
    await seedDatabase();
    console.log("Seeders completed successfully");
  } catch (error) {
    console.error("Error running seeders:", error);
    throw error;
  }
}

const port = environment.port;
const startServer = async () => {
  try {
    console.log(`
**************************************************
Initial Setup
**************************************************`);
    await initDatabase();
    await runSeeders();
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
