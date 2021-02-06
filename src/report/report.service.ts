import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { User, UserDocument } from '../user/schemas/user.schema';
import { HotDeal, HotDealDocument } from '../hot-deal/schemas/hot-deal.schema';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(HotDeal.name) private readonly hotDealModule: Model<HotDealDocument>,
    private readonly coreMessage: CoreMessage
  ) { }

  async getUserCount(): Promise<number> {
    try {
      return await this.userModel.find().countDocuments();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHotDealCount(): Promise<number> {
    try {
      return await this.hotDealModule.find().countDocuments();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTodayHotDealCount(): Promise<number> {
    try {
      return await this.hotDealModule.find(
        {createdDate: { $gte: moment().startOf('days').toDate(), $lte: moment().endOf('days').toDate()}}
      ).countDocuments();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}