import { Student } from "@/interfaces/student.interface";
import { StudentFactory } from "@/database/factories/student.factory";

export const seedStudents = (count: number): Student[] => {
    return StudentFactory.createMany(count);
};

export default seedStudents;