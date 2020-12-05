import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { PasswordHelper } from '../common/helpers/password.helper';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private passwordHelper: PasswordHelper
  ) { }

  async findUser(userName: string): Promise<IUser> {
    const find = await this.userModel.find({ userName }).exec();
    return find.length > 0 ? find[0] : null
  }

  async login(user: IUser) {
    const payload = { username: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const create = new this.userModel(registerUserDto);
    return create.save();
  }

  async validateUser(userName: string, pass: string): Promise<any> {
    let findUser: IUser | null = null;
    const find = await this.userModel.find({ userName }).exec();
    findUser = find.length > 0 ? find[0] : null;
    
    if(findUser != null){
      const check = await this.passwordHelper.verifyPasswordHash(pass, findUser.password);
      return check ? findUser : null;
    }
    return findUser;
  }

  async registerFindUser(userName: string, email: string): Promise<boolean> {
    const user = await this.userModel.find({ $or: [{ userName }, { email }] }).exec();
    return user.length > 0 ? true : false;
  }


}