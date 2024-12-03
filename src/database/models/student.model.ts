import { students } from '@/config/database';
import { Student } from '@/interfaces/student.interface';
import { nanoid } from 'nanoid';

const getById = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
}

const getAll = (): Student[] => {
    return students;
}

const create = (student: Student) => {
    const id = nanoid();
    const newStudent = {...student, id};
    students.push(newStudent);
    return newStudent;
}

export default {
    getById,
    getAll,
    create,
};
