import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';

//import { CatsModule } from './register/register.module';

import { UserModule } from './user/user.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/sicak_firsatlar'),
    UserModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}