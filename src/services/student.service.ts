import StudentModel from "@/database/models/student.model";
import { Student } from "@/interfaces/student.interface";

const getAllStudents = () => {
    const students = StudentModel.getAll();
    return students;
};

const getStudentById = (id: string) => {
    const student = StudentModel.getById(id);
    return student;
};

const createStudent = (student: Student) => {
    const newStudent = StudentModel.create(student);
    return newStudent;
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
};  
