interface IPagination {
    pageSize: number;
    page: number;
    skip: number;
}

export interface IQuery {
    searchQuery: any;
    pagination: IPagination;
    order: any;
}