import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DenemeModule } from './deneme/deneme.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/sicak_firsatlar'),
    UserModule,
    DenemeModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}