import { Document } from 'mongoose';

export interface ICategory extends Document {
    readonly title: string;
    readonly description: string;
}