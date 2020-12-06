import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserMessage } from '../common/messages/user.message';

import { Config } from '../app.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordHelper } from '../common/helpers/password.helper';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages/core.message';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: Config.jwtSecretKey,
      signOptions: { expiresIn: Config.jwtExpiresIn },
    })
  ],
  controllers: [UserController],
  providers: [LocalStrategy, JwtStrategy, PasswordHelper, ExceptionHelper, CoreMessage, UserMessage, UserService],
})

export class UserModule {}