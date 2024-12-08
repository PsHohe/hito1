import { IStudent } from "../interfaces/student.interface";

export const toDbNames = (student: IStudent) => {
    return {
        id: student.id,
        name: student.name,
        lastname1: student.lastName1,
        lastname2: student.lastName2,
        dateofbirth: student.dateOfBirth,
        gender: student.gender
    };
};