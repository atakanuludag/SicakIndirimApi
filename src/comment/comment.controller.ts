import { Body, Request, Controller, Get, Param, Query, HttpStatus, Post, UseGuards  } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { IComment } from './interfaces/comment.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { QueryHelper } from '../common/helpers/query.helper';

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
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(createCommentDto, userId);
  }

  
}
