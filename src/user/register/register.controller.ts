import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
//import { User } from '../shared/schemas/user.schema';

import { UserMessage } from '../../common/messages/user.message';

import { SuccessException } from '../../common/exceptions';

@Controller('user/register')
export class RegisterController {
  constructor(private readonly service: RegisterService, private readonly message: UserMessage) {}


  async passwordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString("hex");
      scrypt(password, salt, 64, (err, derivedKey) => {
        const hash = salt + ":" + derivedKey.toString('hex');
        resolve(hash);
      });
    });
  }

  @Post()
  async create(@Body() registerUserDto: RegisterUserDto) {
    const userCheck = await this.service.findUser(registerUserDto.userName, registerUserDto.email);
    
    //throw new SuccessException("test");
    
    if(userCheck) throw new HttpException({
      atakan: this.message.REGISTER_EXISTING_USER
    }, HttpStatus.OK);
    
    registerUserDto.password = await this.passwordHash(registerUserDto.password);
    await this.service.create(registerUserDto);
  }


}