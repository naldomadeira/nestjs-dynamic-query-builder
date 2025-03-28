import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export async function applyPagination<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: Record<string, any>,
  defaultLimit = 15,
  maxLimit = 100,
): Promise<{ data: T[]; meta: any }> {
  const page = parseInt(query.page || "1", 10);
  const perPage = Math.min(
    parseInt(query.limit || `${defaultLimit}`, 10),
    maxLimit,
  );
  const offset = (page - 1) * perPage;

  const [data, total] = await qb.skip(offset).take(perPage).getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      perPage,
      lastPage: Math.ceil(total / perPage),
    },
  };
}
