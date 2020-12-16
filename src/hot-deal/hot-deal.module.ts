import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HotDealController } from './hot-deal.controller';
import { HotDeal, HotDealSchema } from './schemas/hot-deal.schema';
import { HotDealService } from './hot-deal.service';

import { CoreMessage } from '../common/messages';
import { ExceptionHelper } from '../common/helpers/exception.helper';

import { QueryHelper } from '../common/helpers/query.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HotDeal.name, schema: HotDealSchema }]),
  ],
  controllers: [HotDealController],
  providers: [ExceptionHelper, CoreMessage, QueryHelper, HotDealService],
})

export class HotDealModule {}