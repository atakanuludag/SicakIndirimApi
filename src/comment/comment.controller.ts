import { Body, Request, Controller, Get, Param, Query, HttpStatus, Post, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { IComment } from './interfaces/comment.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { QueryHelper } from '../common/helpers/query.helper';
import { User } from '../common/decorators/user.decorator';
import UserRole from '../common/enums/user-role.enum';
import { IUserEntity } from '../common/interfaces/user.entity.interface';
import { ParamsDto } from '../common/params.dto';

@Controller()
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly coreMessage: CoreMessage,
    private readonly queryHelper: QueryHelper
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('comment/:id')
  async getItemById(@Param('id') id: string) {
    const data: IComment = await this.service.findById(id);
    if (!data.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('comment')
  async list(@Query() query) {
    const listItemsHelper = this.queryHelper.instance(query);
    const items = await this.service.getItems(listItemsHelper);
    return items;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('comment')
  async create(@Body() body: CreateCommentDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(body, userId);
  }

  /*@UseGuards(JwtAuthGuard)
  @Patch('comment/:id')
  async update(@User() user: IUserEntity, @Body() body: UpdateCommentDto, @Param() params: ParamsDto) {

    const roles = user.roles;
    const isAdmin = roles.some((r) => r === UserRole.ADMIN);

    if(!isAdmin && params.id !== user.userId){
      //Eğer güncelleme yapmak isteyen kişi admin değilse ve kendi yorumu dışındaki başka yorumu update etmek istiyorsa geriye Bad Request döndürür.
      throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    await this.service.update(body, params.id);
  }*/

  
}
