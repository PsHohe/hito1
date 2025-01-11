import { Student } from "@/database/models/student.model";
import { IStudent } from "@/interfaces/student.interface";

const getAllStudents = async () => {
    const students = await Student.findAll();
    return students;
};

const getStudentById = async (id: string) => {
    const student = await Student.findByPk(id);
    return student;
};

const createStudent = async (studentData: Omit<IStudent, 'id'>) => {
    const student = await Student.create(studentData);
    return student;
};

const updateStudent = async (id: string, studentData: Partial<IStudent>) => {
    const student = await Student.findByPk(id);
    if (!student) {
        throw new Error('Student not found');
    }
    const updatedStudent = await student.update(studentData);
    return updatedStudent;
};

const deleteStudent = async (id: string) => {
    const student = await Student.findByPk(id);
    if (!student) {
        throw new Error('Student not found');
    }
    await student.destroy();
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};  