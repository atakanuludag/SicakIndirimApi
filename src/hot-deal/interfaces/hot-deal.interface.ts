import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';


export interface IHotDeal extends Document {
    readonly title: string;
    readonly shortDescription: string;
    readonly content: string;
    readonly url: string;
    readonly dueDate: Date;
    readonly user: User;
    readonly createdDate: Date;
    readonly updatedDate: Date;
}