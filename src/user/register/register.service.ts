import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDocument } from '../shared/schemas/user.schema';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const create = new this.userModel(registerUserDto);
    return create.save();
  }

  async findUser(userName: string, email): Promise<boolean> {
    const user = await this.userModel.find({ $or: [{ userName }, { email }] }).exec();
    return user.length > 0 ? true : false;
  }

}