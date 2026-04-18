export interface PagedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}
//todo: move dtos somewhere
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}
