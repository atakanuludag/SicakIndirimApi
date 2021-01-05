import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from './interfaces/category.interface';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModule: Model<CategoryDocument>,
    private readonly coreMessage: CoreMessage
  ) { }

  
  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    try {
      const create = new this.categoryModule(createCategoryDto);
      return create.save();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*async update(updateCategoryDto: CreateCategoryDto): Promise<ICategory> {
    try {
      const create = new this.categoryModule(createCategoryDto);
      return create.update({});
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }*/

  async findById(id: string): Promise<ICategory> {
    try {
      const find = await this.categoryModule.findById(id).exec();
      return find;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(): Promise<ICategory[]> {
    try {
      const items = await this.categoryModule.find().exec();
      return items;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






}