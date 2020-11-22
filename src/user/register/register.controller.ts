import { Body, Controller, Get, Post } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../shared/schemas/user.schema';


@Controller('user/register')
export class RegisterController {
  constructor(private readonly service: RegisterService) {}

  async passwordHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString("hex");
      scrypt(password, salt, 64, (err, derivedKey) => {
        const hash = salt + ":" + derivedKey.toString('hex');
        resolve(hash);
      });
    });
  }
  //https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
  @Post()
  async create(@Body() registerUserDto: RegisterUserDto) {

    registerUserDto.password = await this.passwordHash(registerUserDto.password);
    await this.service.create(registerUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.service.findAll();
  }
}