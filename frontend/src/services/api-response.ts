export type ApiPaginatedResponse<T> = {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};

export type ApiListResponse<T> = T[] | ApiPaginatedResponse<T>;

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function unwrapList<T>(payload: ApiListResponse<T>): T[] {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
}

export function cleanParams(params: QueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}
