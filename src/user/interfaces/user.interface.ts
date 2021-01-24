import { Document } from 'mongoose';
import UserRole from '../../common/enums/user-role.enum';

export interface IUser extends Document {
    readonly userName: string;
    readonly email: string;
    readonly password: string;
    readonly name: string;
    readonly surname: string;
    readonly roles: string[];
}