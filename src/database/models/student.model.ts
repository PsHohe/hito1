import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { differenceInYears } from 'date-fns';

@Table({
    tableName: 'students',
    timestamps: false
})
export class Student extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'lastName1'
    })
    declare lastName1: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'lastName2'
    })
    declare lastName2: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
        field: 'dateOfBirth',
        get() {
            const value = this.getDataValue('dateOfBirth');
            return value ? new Date(value) : null;
        }
    })
    declare dateOfBirth: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare gender: string;

    get age(): number | null {
        if (!this.dateOfBirth) return null;
        return differenceInYears(new Date(), this.dateOfBirth);
    }

    toJSON() {
        const values = super.toJSON();
        return {
            ...values,
            age: this.age
        };
    }
}

export default Student;