import { Request, Response } from "express";
import studentService from "@/services/student.service";
import { format, parse } from 'date-fns';

const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentService.getAllStudents();
        res.json(students);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createStudent = async (req: Request, res: Response) => {
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
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentById = async (req: Request, res: Response) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({
            ...student,
            dateOfBirth: format(new Date(student.dateOfBirth), 'dd-MM-yyyy')
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getStudents, createStudent, getStudentById };