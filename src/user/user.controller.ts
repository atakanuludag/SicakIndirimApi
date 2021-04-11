import { Body, Controller, HttpStatus, Post, Get, Patch, UseGuards, Request, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamsDto } from '../common/params.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { PasswordHelper } from '../common/helpers/password.helper';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { UserMessage, CoreMessage } from '../common/messages';
import { IUser } from '../common/interfaces/user.interface';
import { IUserEntity } from '../common/interfaces/user.entity.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import UserRole from '../common/enums/user-role.enum';
import { User } from '../common/decorators/user.decorator';


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
  async create(@Body() body: RegisterUserDto) {
    const userCheck = await this.service.findUser(body.userName, body.email);
    if (userCheck) throw new ExceptionHelper(this.userMessage.EXISTING_USER, HttpStatus.BAD_REQUEST);
    body.password = await this.passwordHelper.passwordHash(body.password);
    await this.service.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  async profile(@Request() req) {
    const userId = req.user.userId;
    const user: IUser = await this.service.findUserById(userId);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('user/:id')
  async userById(@Param('id') id: string) {
    const user: IUser = await this.service.findUserById(id);
    if (!user.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('user')
  async list() {
    return await this.service.getItems();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id')
  async update(@User() user: IUserEntity, @Body() body: UpdateUserDto, @Param() params: ParamsDto) {

    const roles = user.roles;
    const isAdmin = roles.some((r) => r === UserRole.ADMIN);

    if(body.roles){
      if(!isAdmin){
        //Güncelleme yapmak isteyen kişi admin değilse ve role değiştirmek istiyorsa geriye UNAUTHORIZED döndürür.
        throw new ExceptionHelper(this.coreMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
    }

    if(!isAdmin && params.id !== user.userId){
      //Eğer güncelleme yapmak isteyen kişi admin değilse ve kendi kullanıcısı dışındaki başka kullanıcıyı update etmek istiyorsa geriye Bad Request döndürür.
      throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const userData = await this.service.findUserById(params.id);
    const findUserName = userData.userName !== body.userName ? body.userName : undefined;
    const findEmail = userData.email !== body.email ? body.email : undefined;

    const userCheck = await this.service.findUser(findUserName, findEmail);
    
    if (userCheck) throw new ExceptionHelper(this.userMessage.EXISTING_USER, HttpStatus.BAD_REQUEST);
    if(body.password) body.password = await this.passwordHelper.passwordHash(body.password);
    await this.service.update(body, params.id);
  }

}