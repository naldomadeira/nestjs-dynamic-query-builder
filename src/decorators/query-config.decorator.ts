import { SetMetadata } from "@nestjs/common";

export const QUERY_CONFIG_KEY = "QUERY_CONFIG";

export interface QueryConfigOptions {
  entity: Function;
  filters?: string[];
  sorts?: string[];
  includes?: string[];
  fields?: string[];
  paginated?: boolean;
}

export const QueryConfig = (options: QueryConfigOptions) =>
  SetMetadata(QUERY_CONFIG_KEY, options);
