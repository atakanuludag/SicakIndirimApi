import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { scrypt } from 'crypto';
import { LoginService } from './login.service';
import { User } from '../shared/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user/login')
export class LoginController {
  constructor(private readonly service: LoginService) {}

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
  
  @Post()
  async login(@Body() registerUserDto: LoginUserDto) {
    const userFind = await this.service.findUser(registerUserDto.userName);
    if(!userFind) throw new HttpException('NO_CONTENT', HttpStatus.NO_CONTENT);
    const check = await this.verifyPasswordHash(registerUserDto.password, userFind.password);
    if(!check){
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } else {
      throw new HttpException('OK', HttpStatus.OK);
    }
  }
}

//https://stackoverflow.com/questions/55820591/nestjs-jwt-authentication-returns-401