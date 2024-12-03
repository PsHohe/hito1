import { body, param, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateCreateStudent: Array<ValidationChain | ((req: Request, res: Response, next: NextFunction) => void)> = [
    body('name').isString().notEmpty(),
    body('lastName1').isString().notEmpty(),
    body('lastName2').isString().notEmpty(),
    body('dateOfBirth').isDate({ format: 'DD-MM-YYYY' }),
    body('gender').isString().notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateGetStudentById: Array<ValidationChain | ((req: Request, res: Response, next: NextFunction) => void)> = [
    param('id').isString().notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];