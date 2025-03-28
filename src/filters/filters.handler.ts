import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: Record<string, any>,
  alias: string,
  allowedFilters: string[],
): void {
  Object.keys(query).forEach((key) => {
    const match = key.match(/^filter\[(\w+)\](?:\[(\w+)\])?$/);
    if (!match) return;

    const [, field, operator = "eq"] = match;
    const value = query[key];
    const paramKey = `filter_${field}_${operator}`;

    if (!allowedFilters.includes(field)) return;

    switch (operator) {
      case "eq":
        qb.andWhere(`${alias}.${field} = :${paramKey}`, { [paramKey]: value });
        break;
      case "like":
        qb.andWhere(`${alias}.${field} LIKE :${paramKey}`, {
          [paramKey]: `%${value}%`,
        });
        break;
      case "gt":
        qb.andWhere(`${alias}.${field} > :${paramKey}`, { [paramKey]: value });
        break;
      case "lt":
        qb.andWhere(`${alias}.${field} < :${paramKey}`, { [paramKey]: value });
        break;
      case "in":
        qb.andWhere(`${alias}.${field} IN (:...${paramKey})`, {
          [paramKey]: value.split(","),
        });
        break;
    }
  });
}
