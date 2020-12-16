import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema'
import { HotDeal } from '../../hot-deal/schemas/hot-deal.schema'

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  
  @Prop({ required: true })
  comment: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "HotDeal" , })
  hotDeal: HotDeal;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ default: Date.now })
  createdDate: Date;

  @Prop({ default: Date.now })
  updatedDate: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);