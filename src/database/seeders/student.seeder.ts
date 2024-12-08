import { IStudent } from "@/interfaces/student.interface";
import { StudentFactory } from "@/database/factories/student.factory";

export const seedStudents = async (count: number): Promise<IStudent[]> => {
    return StudentFactory.createMany(count);
};

export default seedStudents;