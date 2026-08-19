export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
  path: string;
  totalRecords?: number;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  message: string;
  errors?: string[] | Record<string, unknown>;
  statusCode: number;
  timestamp: string;
  path: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedData<T> {
  items: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

export interface LazyLoadEvent {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  filters?: any;
  globalFilter?: string;
}