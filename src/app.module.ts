import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './app.config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { HotDealModule } from './hot-deal/hot-deal.module';
import { CommentModule } from './comment/comment.module';



@Module({
  imports: [
    MongooseModule.forRoot(Config.mongoDbConnectionString),
    UserModule,
    CategoryModule,
    HotDealModule,
    CommentModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}