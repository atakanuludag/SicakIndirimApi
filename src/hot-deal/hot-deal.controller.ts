import { Body, Request, Controller, Get, Param, Query, HttpStatus, Post, UseGuards  } from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { CreateHotDealDto } from './dto/create-hot-deal.dto';

import { HotDealService } from './hot-deal.service';


import { IHotDeal } from './interfaces/hot-deal.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { HotDealMessage, CoreMessage } from '../common/messages';
import { QueryHelper } from '../common/helpers/query.helper';

@Controller()
export class HotDealController {
  constructor(
    private readonly service: HotDealService,
    private readonly coreMessage: CoreMessage,
    private readonly hotDealMessage: HotDealMessage,
    private readonly queryHelper: QueryHelper
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('hotDeal/:id')
  async getItemById(@Param('id') id: string) {
    const data: IHotDeal = await this.service.findById(id);
    if (!data.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('hotDeal')
  async list(@Query() query) {
    const listItemsHelper = this.queryHelper.instance(query);
    const items = await this.service.getItems(listItemsHelper);
    return items;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('hotDeal')
  async create(@Body() createHotDealDto: CreateHotDealDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(createHotDealDto, userId);
  }

  
}
