import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Repository, DataSource } from "typeorm";
import { QueryBuilder } from "../core/query-builder";
import { QUERY_CONFIG_KEY, QueryConfigOptions } from "./query-config.decorator";

export const QueryBuilderDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    const reflector = new Reflector();

    const handler = ctx.getHandler();
    const config: QueryConfigOptions = reflector.get(QUERY_CONFIG_KEY, handler);

    if (!config || !config.entity) {
      throw new BadRequestException("Missing @QueryConfig({ entity })");
    }

    const dataSource: DataSource = request.app.get(DataSource);
    const repository: Repository<any> = dataSource.getRepository(config.entity);
    const alias = "root";

    const qb = new QueryBuilder(repository, query, alias);

    if (config.filters) qb.allowFilters(config.filters);
    if (config.sorts) qb.allowSorts(config.sorts);
    if (config.includes) qb.allowIncludes(config.includes);
    if (config.fields) qb.allowFields(config.fields);
    if (config.paginated === false) qb.setPaginated(false);

    return qb;
  },
);
