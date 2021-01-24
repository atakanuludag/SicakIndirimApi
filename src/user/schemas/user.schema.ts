import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import UserRole from '../../common/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true, unique: true  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ default: [UserRole.USER], type: [String], enum: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);