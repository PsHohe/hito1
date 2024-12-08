import StudentModel from "@/database/models/student.model";
import { IStudent } from "@/interfaces/student.interface";

const getAllStudents = () => {
    const students = StudentModel.getAll();
    return students;
};

const getStudentById = (id: string) => {
    const student = StudentModel.getById(id);
    return student;
};

const createStudent = (student: IStudent) => {
    const newStudent = StudentModel.create(student);
    return newStudent;
};

const updateStudent = (id: string, student: IStudent) => {
    const updatedStudent = StudentModel.updateById(id, student);
    return updatedStudent;
};

const deleteStudent = async (id: string) => {
    const deleted = await StudentModel.deleteById(id);
    return deleted;
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};  