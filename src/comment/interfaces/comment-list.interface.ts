import { IListQueryResponse } from '../../common/interfaces/list-query-response.interface';
import { IComment } from './comment.interface';

export interface ICommentList extends IListQueryResponse {
    results: IComment[];
}