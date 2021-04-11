import { Body, Request, Controller, Get, Param, Query, HttpStatus, Post, UseGuards, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateHotDealDto } from './dto/create-hot-deal.dto';
import { UpdateHotDealDto } from './dto/update-hot-deal.dto';
import { ParamsDto } from '../common/params.dto';
import { HotDealService } from './hot-deal.service';
import { IHotDeal } from './interfaces/hot-deal.interface';
import { IUserEntity } from '../common/interfaces/user.entity.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { QueryHelper } from '../common/helpers/query.helper';
import { User } from '../common/decorators/user.decorator';
import UserRole from '../common/enums/user-role.enum';

@Controller()
export class HotDealController {
  constructor(
    private readonly service: HotDealService,
    private readonly coreMessage: CoreMessage,
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
  async create(@Body() body: CreateHotDealDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(body, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('hotDeal/:id')
  async update(@User() user: IUserEntity, @Body() body: UpdateHotDealDto, @Param() params: ParamsDto) {

    const roles = user.roles;
    const isAdmin = roles.some((r) => r === UserRole.ADMIN);
    //Todo: burada params.id yerine hotDeal'daki userid yi kontrol edeceğiz. Burada bug var. Aynısı comment update içinde geçerli.
    if(!isAdmin && params.id !== user.userId){
      //Eğer güncelleme yapmak isteyen kişi admin değilse ve kendi konusu dışındaki başka konuyu update etmek istiyorsa geriye Bad Request döndürür.
      throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    await this.service.update(body, params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('hotDeal/:id')
  async delete(@Param() params: ParamsDto) {
    await this.service.delete(params.id);
  }
}
