import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IHotDeal } from './interfaces/hot-deal.interface';
import { HotDeal, HotDealDocument } from './schemas/hot-deal.schema';
import { CreateHotDealDto } from './dto/create-hot-deal.dto';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { HotDealMessage, CoreMessage } from '../common/messages';

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






}