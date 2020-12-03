import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserMessage } from '../common/messages/user.message';



@Controller()
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly message: UserMessage
  ) {}

  async verifyPasswordHash(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");
      scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          if(key == derivedKey.toString('hex')){
            resolve(true);
          } else {
            resolve(false);
          }
      });
    })
  }

  async passwordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString("hex");
      scrypt(password, salt, 64, (err, derivedKey) => {
        const hash = salt + ":" + derivedKey.toString('hex');
        resolve(hash);
      });
    });
  }
  
  @Post('user/login')
  async login(@Body() registerUserDto: LoginUserDto) {
    const user = await this.service.findUser(registerUserDto.userName);
    if(!user) throw new HttpException('NO_CONTENT', HttpStatus.NO_CONTENT);
    const check = await this.verifyPasswordHash(registerUserDto.password, user.password);
    if(!check){
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } else {
      return this.service.login(user)

      //throw new HttpException('OK', HttpStatus.OK);
    }
  }
  


  @Post('user/register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    const userCheck = await this.service.registerFindUser(registerUserDto.userName, registerUserDto.email);
    
    //throw new SuccessException("test");
    
    if(userCheck) throw new HttpException({
      atakan: this.message.REGISTER_EXISTING_USER
    }, HttpStatus.BAD_REQUEST);
    
    registerUserDto.password = await this.passwordHash(registerUserDto.password);
    await this.service.create(registerUserDto);
  }
  
}

//https://stackoverflow.com/questions/55820591/nestjs-jwt-authentication-returns-401