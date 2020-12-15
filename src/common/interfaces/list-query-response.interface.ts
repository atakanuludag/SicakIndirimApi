export interface IListQueryResponse {
    totalResults: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    currentPageSize: number;
    results: any;
}