export interface ApiMeta {
  requestId?: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  meta?: ApiMeta | null;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  message: string;
  error: ApiErrorBody;
  meta?: ApiMeta | null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  data: T[];
  pagination: PaginationMeta;
}

export function isApiErrorResponse<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.success === false;
}
