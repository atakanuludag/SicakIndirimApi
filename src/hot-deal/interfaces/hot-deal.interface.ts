import { Document } from 'mongoose';

export interface IHotDeal extends Document {
    readonly title: string;
    readonly shortDescription: string;
    readonly content: string;
    readonly url: string;
}