export type QueryResult<T> = {
  data: T[];
  meta?: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
};

export interface QueryBuilderGlobalConfig {
  defaultAlias?: string;
  enableLogging?: boolean;
  pagination?: {
    defaultLimit?: number;
    maxLimit?: number;
  };
}
