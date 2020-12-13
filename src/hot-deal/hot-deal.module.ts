import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HotDealController } from './hot-deal.controller';
import { HotDeal, HotDealSchema } from './schemas/hot-deal.schema';
import { HotDealService } from './hot-deal.service';

import { CoreMessage, HotDealMessage } from '../common/messages';
import { ExceptionHelper } from '../common/helpers/exception.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HotDeal.name, schema: HotDealSchema }]),
  ],
  controllers: [HotDealController],
  providers: [ExceptionHelper, CoreMessage, HotDealMessage, HotDealService],
})

export class HotDealModule {}