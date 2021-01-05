import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryService } from './category.service';

import { CoreMessage } from '../common/messages';
import { ExceptionHelper } from '../common/helpers/exception.helper';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [ExceptionHelper, CoreMessage, CategoryService],
})

export class CategoryModule {}