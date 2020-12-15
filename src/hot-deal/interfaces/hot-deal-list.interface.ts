import { IListQueryResponse } from '../../common/interfaces/list-query-response.interface';
import { IHotDeal } from './hot-deal.interface';

export interface IHotDealList extends IListQueryResponse {
    results: IHotDeal[];
}