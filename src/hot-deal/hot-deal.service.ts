import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHotDealList } from './interfaces/hot-deal-list.interface';
import { IHotDeal } from './interfaces/hot-deal.interface';
import { HotDeal, HotDealDocument } from './schemas/hot-deal.schema';
import { CreateHotDealDto } from './dto/create-hot-deal.dto';
import { UpdateHotDealDto } from './dto/update-hot-deal.dto';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { IQuery } from '../common/interfaces/query.interface';


@Injectable()
export class HotDealService {
  constructor(
    @InjectModel(HotDeal.name) private readonly hotDealModel: Model<HotDealDocument>,
    private readonly coreMessage: CoreMessage
  ) { }

  
  async create(createHotDealDto: CreateHotDealDto, userId: string): Promise<HotDeal> {
    try {
      const data = {...createHotDealDto, user: userId };
      const create = new this.hotDealModel(data);
      return create.save();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<IHotDeal> {
    try {
      const find = await this.hotDealModel.findById(id).populate("user").populate("category").exec();
      return find;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(query: IQuery): Promise<IHotDealList> {
    try {
      const items = await this.hotDealModel.find(query.searchQuery)
      .populate("user")
      .populate("category")
      .skip(query.pagination.skip)
      .limit(query.pagination.pageSize)
      .sort(query.order).exec();

      const count = await this.hotDealModel.find(query.searchQuery).countDocuments();

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

  async update(updateDto: UpdateHotDealDto, id: string): Promise<IHotDealList> {
    try {
      const find = await this.hotDealModel.findById(id);
      return find.updateOne(updateDto);
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<void> {
    try {;
      await this.hotDealModel.deleteOne({_id: id});
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }







}