export interface PageResponse<T> {
  content: T[];
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
