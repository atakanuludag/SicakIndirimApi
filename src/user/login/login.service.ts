import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../shared/schemas/user.schema';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async findUser(userName: string): Promise<User> {
    const find = await this.userModel.find({ userName }).exec();
    return find.length > 0 ? find[0] : null
  }
}