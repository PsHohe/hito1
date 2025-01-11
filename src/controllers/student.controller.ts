import { Request, Response } from "express";
import studentService from "@/services/student.service";

const formatDate = (date: Date | string) => {
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date');
        }
        const offset = dateObj.getTimezoneOffset();
        const adjustedDate = new Date(dateObj.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0].split('-').reverse().join('-');
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const validateUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentService.getAllStudents();
        res.json(students.map(student => ({
            ...student.toJSON(),
            dateOfBirth: formatDate(student.dateOfBirth)
        })));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createStudent = async (req: Request, res: Response) => {
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
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) {
            res.status(400).json({ error: 'Invalid student ID format' });
            return;
        }

        const student = await studentService.getStudentById(id);
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({
            ...student.toJSON(),
            dateOfBirth: formatDate(student.dateOfBirth)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) {
            res.status(400).json({ error: 'Invalid student ID format' });
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
    } catch (error: any) {
        if (error?.message === 'Student not found') {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) {
            res.status(400).json({ error: 'Invalid student ID format' });
            return;
        }

        await studentService.deleteStudent(id);
        res.status(204).send();
    } catch (error: any) {
        if (error?.message === 'Student not found') {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getStudents, createStudent, getStudentById, updateStudent, deleteStudent };