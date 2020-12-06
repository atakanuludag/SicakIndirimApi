import { Body, Controller, HttpException, HttpStatus, Post, Get, UseGuards, Request, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { PasswordHelper } from '../common/helpers/password.helper';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { UserMessage } from '../common/messages/user.message';
import { CoreMessage } from '../common/messages/core.message';
import { IUser } from './interfaces/user.interface';

@Controller()
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly userMessage: UserMessage,
    private passwordHelper: PasswordHelper,
    private coreMessage: CoreMessage
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Request() req) {
    return this.service.login(req.user);
  }

  @Post('user/register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    try {
      const userCheck = await this.service.registerFindUser(registerUserDto.userName, registerUserDto.email);
      if (userCheck) return new ExceptionHelper(this.userMessage.REGISTER_EXISTING_USER, HttpStatus.BAD_REQUEST);
      registerUserDto.password = await this.passwordHelper.passwordHash(registerUserDto.password);
      await this.service.register(registerUserDto);
    } catch(err){
      return err
    }

  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  async getProfile(@Request() req) {
    try {
      const id = req.user.userId;
      const user: IUser = await this.service.findUserById(id);
      return user;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const user: IUser = await this.service.findUserById(id);
      if (!user.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
      return user;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

//https://stackoverflow.com/questions/55820591/nestjs-jwt-authentication-returns-401