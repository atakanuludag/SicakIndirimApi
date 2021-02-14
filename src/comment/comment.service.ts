import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICommentList } from './interfaces/comment-list.interface';
import { IComment } from './interfaces/comment.interface';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ExceptionHelper } from '../common/helpers/exception.helper';
import { CoreMessage } from '../common/messages';
import { IQuery } from '../common/interfaces/query.interface';


@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    private readonly coreMessage: CoreMessage
  ) { }

  
  async create(createcommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    try {
      const data = {...createcommentDto, user: userId };
      const create = new this.commentModel(data);
      return create.save();
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<IComment> {
    try {
      const find = await this.commentModel.findById(id).populate("user").populate("hotDeal").exec();
      return find;
    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getItems(query: IQuery): Promise<ICommentList> {
    try {
      const items = await this.commentModel.find(query.searchQuery)
      .populate("user")
      .skip(query.pagination.skip)
      .limit(query.pagination.pageSize)
      .sort(query.order).exec();

      const count = await this.commentModel.find(query.searchQuery).countDocuments();

      const data: ICommentList = {
        results: items,
        currentPage: query.pagination.page,
        currentPageSize: items.length,
        pageSize: query.pagination.pageSize,
        totalPages: Math.ceil(count / query.pagination.pageSize),
        totalResults: count
      }
      return data;

    } catch (err) {
      throw new ExceptionHelper(this.coreMessage.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }






}