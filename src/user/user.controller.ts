import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserMessage } from '../common/messages/user.message';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { PasswordHelper } from '../common/helpers/password.helper';


@Controller()
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly message: UserMessage,
    private passwordHelper: PasswordHelper
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Request() req) {
    return this.service.login(req.user);
  }
  


  @Post('user/register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    const userCheck = await this.service.registerFindUser(registerUserDto.userName, registerUserDto.email);
    
    //throw new SuccessException("test");
    
    if(userCheck) throw new HttpException({
      atakan: this.message.REGISTER_EXISTING_USER
    }, HttpStatus.BAD_REQUEST);
    
    registerUserDto.password = await this.passwordHelper.passwordHash(registerUserDto.password);
    await this.service.create(registerUserDto);
  }
  
}

//https://stackoverflow.com/questions/55820591/nestjs-jwt-authentication-returns-401