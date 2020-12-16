import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentService } from './comment.service';

import { CoreMessage } from '../common/messages';
import { ExceptionHelper } from '../common/helpers/exception.helper';

import { QueryHelper } from '../common/helpers/query.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentController],
  providers: [ExceptionHelper, CoreMessage, QueryHelper, CommentService],
})

export class CommentModule {}