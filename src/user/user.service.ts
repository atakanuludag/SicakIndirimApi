import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../common/interfaces/user.interface';
import { IUserEntity } from '../common/interfaces/user.entity.interface';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHelper } from '../common/helpers/password.helper';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private passwordHelper: PasswordHelper,
    private readonly coreMessage: CoreMessage
  ) { }

  async login(user: IUser) {
    try {
      const payload: IUserEntity = { userName: user.userName, userId: user.id, roles: user.roles };
      return { 
        access_token: this.jwtService.sign(payload),
        user_id: user.id,
        roles: user.roles
      };
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      const create = new this.userModel(registerUserDto);
      return create.save();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(userName: string, pass: string): Promise<IUser | null> {
    try {
      let findUser: IUser | null = null;
      const find = await this.userModel.find({ userName }).select('+password').exec();
      findUser = find.length > 0 ? find[0] : null;

      if (findUser != null) {
        const check = await this.passwordHelper.verifyPasswordHash(pass, findUser.password);
        return check ? findUser : null;
      }
      return findUser;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUser(userName: string | undefined, email: string | undefined): Promise<boolean> {
    try {
      const user = await this.userModel.find({ $or: [{ userName }, { email }] }).exec();
      return user.length > 0 ? true : false;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUserById(id: string): Promise<IUser> {
    try {
      const find = await this.userModel.findById(id).exec();
      return find;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(): Promise<IUser[]> {
    try {
      const items = await this.userModel.find().exec();
      return items;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(updateDto: UpdateUserDto, id: string): Promise<IUser> {
    try {
      const find = await this.userModel.findById(id);
      return find.updateOne(updateDto);
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}