import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './app.config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DenemeModule } from './deneme/deneme.module';



@Module({
  imports: [
    MongooseModule.forRoot(Config.mongoDbConnectionString),
    UserModule,
    DenemeModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}