import { Body, Request, Controller, Get, Param, HttpStatus, Post, Put, UseGuards  } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { ICategory } from './interfaces/category.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';

@Controller()
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly coreMessage: CoreMessage
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('category/:id')
  async getItemById(@Param('id') id: string) {
    const data: ICategory = await this.service.findById(id);
    if (!data.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('category')
  async list() {
    const items = await this.service.getItems();
    return items;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('category')
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(createCategoryDto);
  }

  /*@UseGuards(JwtAuthGuard)
  @Put('category')
  async update(@Body() updateCategoryDto: CreateCategoryDto, @Request() req) {
    const userId = req.user.userId;
    await this.service.create(updateCategoryDto);
  }*/

  
}
