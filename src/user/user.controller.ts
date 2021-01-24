import { Body, Controller, HttpStatus, Post, Get, UseGuards, Request, Param, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { PasswordHelper } from '../common/helpers/password.helper';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { UserMessage, CoreMessage } from '../common/messages';
import { IUser } from './interfaces/user.interface';

import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import UserRole from '../common/enums/user-role.enum';


@Controller()
export class UserController {
  constructor(
    private readonly service: UserService,
    private passwordHelper: PasswordHelper,
    private readonly userMessage: UserMessage,
    private readonly coreMessage: CoreMessage
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Request() req) {
    return this.service.login(req.user);
  }

  @Post('user/register')
  async create(@Body() registerUserDto: RegisterUserDto) {
    const userCheck = await this.service.registerFindUser(registerUserDto.userName, registerUserDto.email);
    if (userCheck) throw new ExceptionHelper(this.userMessage.REGISTER_EXISTING_USER, HttpStatus.BAD_REQUEST);
    registerUserDto.password = await this.passwordHelper.passwordHash(registerUserDto.password);
    await this.service.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/profile')
  @Roles(UserRole.USER) //test amaçlı eklendi.
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    const user: IUser = await this.service.findUserById(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    const user: IUser = await this.service.findUserById(id);
    if (!user.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return user;
  }

}