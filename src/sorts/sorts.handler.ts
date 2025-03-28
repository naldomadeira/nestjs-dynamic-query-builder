import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function applySorts<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: Record<string, any>,
  alias: string,
  allowedSorts: string[],
): void {
  const sortParam = query.sort;
  if (!sortParam) return;

  const sortFields = sortParam.split(",");

  sortFields.forEach((field: string) => {
    const order: "ASC" | "DESC" = field.startsWith("-") ? "DESC" : "ASC";
    const cleanField = field.replace(/^-/, "");

    if (allowedSorts.includes(cleanField)) {
      qb.addOrderBy(`${alias}.${cleanField}`, order);
    }
  });
}
