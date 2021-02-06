import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

import { User, UserSchema } from '../user/schemas/user.schema';
import { HotDeal, HotDealSchema } from '../hot-deal/schemas/hot-deal.schema';

import { CoreMessage } from '../common/messages';
import { ExceptionHelper } from '../common/helpers/exception.helper';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: HotDeal.name, schema: HotDealSchema }
    ]),
  ],
  controllers: [ReportController],
  providers: [ExceptionHelper, CoreMessage, ReportService],
})

export class ReportModule {}