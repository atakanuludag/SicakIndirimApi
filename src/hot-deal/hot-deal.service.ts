import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IHotDealList } from './interfaces/hot-deal-list.interface';
import { IHotDeal } from './interfaces/hot-deal.interface';
import { HotDeal, HotDealDocument } from './schemas/hot-deal.schema';
import { CreateHotDealDto } from './dto/create-hot-deal.dto';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { HotDealMessage, CoreMessage } from '../common/messages';
import { IQuery } from '../common/interfaces/query.interface';


@Injectable()
export class HotDealService {
  constructor(
    @InjectModel(HotDeal.name) private readonly hotDealModule: Model<HotDealDocument>,
    private readonly coreMessage: CoreMessage
  ) { }

  
  async create(createHotDealDto: CreateHotDealDto, userId: string): Promise<HotDeal> {
    try {
      const data = {...createHotDealDto, user: userId };
      const create = new this.hotDealModule(data);
      return create.save();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<IHotDeal> {
    try {
      const find = await this.hotDealModule.findById(id).populate("user").exec();
      return find;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(query: IQuery): Promise<IHotDealList> {
    try {
      const items = await this.hotDealModule.find(query.searchQuery)
      .populate("user")
      .skip(query.pagination.skip)
      .limit(query.pagination.pageSize)
      .sort(query.order).exec();

      const count = await this.hotDealModule.find(query.searchQuery).count();

      const data: IHotDealList = {
        results: items,
        currentPage: query.pagination.page,
        currentPageSize: items.length,
        pageSize: query.pagination.pageSize,
        totalPages: Math.ceil(count / query.pagination.pageSize),
        totalResults: count
      }
      return data;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






}