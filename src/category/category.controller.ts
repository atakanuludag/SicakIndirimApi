import { Body, Controller, Get, Param, HttpStatus, Post, UseGuards, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParamsDto } from './dto/params.dto';
import { CategoryService } from './category.service';
import { ICategory } from './interfaces/category.interface';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import UserRole from '../common/enums/user-role.enum';

@Controller()
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly coreMessage: CoreMessage
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('category/:id')
  async getItemById(@Param() params: ParamsDto) {
    const data: ICategory = await this.service.findById(params.id);
    if (!data.id) throw new ExceptionHelper(this.coreMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('category')
  async list() {
    const items = await this.service.getItems();
    return items;
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('category')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.service.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('category/:id')
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Param() params: ParamsDto) {
    await this.service.update(updateCategoryDto, params.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('category/:id')
  async delete(@Param() params: ParamsDto) {
    await this.service.delete(params.id);
  }
}
