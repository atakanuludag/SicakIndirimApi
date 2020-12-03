import { Module } from '@nestjs/common';

import { DenemeController } from './deneme.controller';


@Module({
  imports: [],
  controllers: [DenemeController],
  providers: [],
})

export class DenemeModule {}