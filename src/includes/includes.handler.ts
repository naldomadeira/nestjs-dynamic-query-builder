import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function applyIncludes<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: Record<string, any>,
  alias: string,
  allowedIncludes: string[],
): void {
  const includes = (query.include || "").split(",").filter(Boolean);

  includes.forEach((relation: string) => {
    if (allowedIncludes.includes(relation)) {
      qb.leftJoinAndSelect(`${alias}.${relation}`, relation);
    }
  });
}
