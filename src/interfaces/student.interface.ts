import { differenceInYears } from 'date-fns';

export interface IStudent {
    id?: string;
    name: string;
    lastName1: string;
    lastName2: string;
    dateOfBirth: Date;
    gender: string;
}

class Student implements IStudent {
    id?: string;
    name: string;
    lastName1: string;
    lastName2: string;
    dateOfBirth: Date;
    gender: string;

    constructor(data: IStudent) {
        if (data.id) this.id = data.id;
        this.name = data.name;
        this.lastName1 = data.lastName1;
        this.lastName2 = data.lastName2;
        this.dateOfBirth = data.dateOfBirth;
        this.gender = data.gender;
    }

    static fromJson(json: any): Student {
        return new Student({
            id: json.id,
            name: json.name,
            lastName1: json.lastname1,
            lastName2: json.lastname2,
            dateOfBirth: new Date(json.dateofbirth),
            gender: json.gender
        });
    }

    get age() {
        return differenceInYears(new Date(), this.dateOfBirth);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            lastName1: this.lastName1,
            lastName2: this.lastName2,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender
        };
    }
}

export default Student;