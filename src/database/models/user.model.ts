import { Table, Column, Model, DataType } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({
    tableName: 'users',
    timestamps: false
})
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare password: string;

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        try {
            if (!this.password || !candidatePassword) {
                return false;
            }
            const isMatch = await bcrypt.compare(candidatePassword, this.password);
            return isMatch;
        } catch (error) {
            return false;
        }
    }

    toJSON() {
        const values = super.toJSON();
        delete values.password;
        return values;
    }
}

export default User;
