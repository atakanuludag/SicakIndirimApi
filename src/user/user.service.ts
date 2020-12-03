import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async findUser(userName: string): Promise<User> {
    const find = await this.userModel.find({ userName }).exec();
    return find.length > 0 ? find[0] : null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }




  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const create = new this.userModel(registerUserDto);
    return create.save();
  }

  async registerFindUser(userName: string, email): Promise<boolean> {
    const user = await this.userModel.find({ $or: [{ userName }, { email }] }).exec();
    return user.length > 0 ? true : false;
  }


}