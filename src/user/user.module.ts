import { Module } from '@nestjs/common';

import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';


import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';


import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shared/schemas/user.schema';


import { UserMessage } from '../common/messages/user.message';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [RegisterController, LoginController],
  providers: [UserMessage, RegisterService, LoginService],
})

export class UserModule {}