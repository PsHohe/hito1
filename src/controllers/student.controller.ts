import { Request, Response } from "express";
import studentService from "@/services/student.service";
import { format, parse } from 'date-fns';
import Student from "@/interfaces/student.interface";

const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentService.getAllStudents();
        res.json(students.map(student => {
            const studentObj = Student.fromJson(student);
            return {
                ...studentObj,
                dateOfBirth: format(new Date(studentObj.dateOfBirth), 'dd-MM-yyyy')
            };
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createStudent = async (req: Request, res: Response) => {
    try {
        const studentData = {
            ...req.body,
            dateOfBirth: parse(req.body.dateOfBirth, 'dd-MM-yyyy', new Date())
        };
        const studentRaw = await studentService.createStudent(studentData);
        const student = Student.fromJson(studentRaw);
        res.status(201).json({
            ...student,
            dateOfBirth: format(new Date(student.dateOfBirth), 'dd-MM-yyyy')
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentById = async (req: Request, res: Response) => {
    try {
        const studentRaw = await studentService.getStudentById(req.params.id);
        if (!studentRaw) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        const student = Student.fromJson(studentRaw);
        res.json({
            ...student,
            dateOfBirth: format(new Date(student.dateOfBirth), 'dd-MM-yyyy')
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStudent = async (req: Request, res: Response) => {
    try {
        const studentData = {
            ...req.body,
            dateOfBirth: parse(req.body.dateOfBirth, 'dd-MM-yyyy', new Date())
        };
        const studentRaw = await studentService.updateStudent(req.params.id, studentData);
        const student = Student.fromJson({...studentRaw, id: req.params.id});
        res.status(200).json({
            ...student,
            dateOfBirth: format(new Date(student.dateOfBirth), 'dd-MM-yyyy')
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        await studentService.deleteStudent(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getStudents, createStudent, getStudentById, updateStudent, deleteStudent };