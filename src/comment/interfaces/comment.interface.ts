import { Document } from 'mongoose';
import { HotDeal } from '../../hot-deal/schemas/hot-deal.schema';
import { User } from '../../user/schemas/user.schema';

export interface IComment extends Document {
    readonly comment: string;
    readonly hotDeal: HotDeal;
    readonly user: User;
    readonly createdDate: Date;
    readonly updatedDate: Date;
}