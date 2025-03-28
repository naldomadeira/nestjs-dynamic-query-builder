import { ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

export class QueryBuilder<T extends ObjectLiteral> {
  private qb: SelectQueryBuilder<T>;
  private alias: string;

  private filters: string[] = [];
  private sorts: string[] = [];
  private includes: string[] = [];
  private fields: string[] = [];

  private isPaginated = true;

  constructor(
    private readonly repository: Repository<T>,
    public readonly query: Record<string, any>,
    alias = "root",
  ) {
    this.alias = alias;
    this.qb = this.repository.createQueryBuilder(this.alias);
  }

  setPaginated(value: boolean): this {
    this.isPaginated = value;
    return this;
  }

  allowFilters(fields: string[]): this {
    this.filters = fields;

    Object.keys(this.query).forEach((key) => {
      const match = key.match(/^filter\[(\w+)\](?:\[(\w+)\])?$/);
      if (!match) return;

      const [, field, operator = "eq"] = match;
      const value = this.query[key];
      const paramKey = `filter_${field}_${operator}`;

      if (!this.filters.includes(field)) return;

      switch (operator) {
        case "eq":
          this.qb.andWhere(`${this.alias}.${field} = :${paramKey}`, {
            [paramKey]: value,
          });
          break;
        case "like":
          this.qb.andWhere(`${this.alias}.${field} LIKE :${paramKey}`, {
            [paramKey]: `%${value}%`,
          });
          break;
        case "gt":
          this.qb.andWhere(`${this.alias}.${field} > :${paramKey}`, {
            [paramKey]: value,
          });
          break;
        case "lt":
          this.qb.andWhere(`${this.alias}.${field} < :${paramKey}`, {
            [paramKey]: value,
          });
          break;
        case "in":
          this.qb.andWhere(`${this.alias}.${field} IN (:...${paramKey})`, {
            [paramKey]: value.split(","),
          });
          break;
        // adiciona outros operadores conforme necessário
      }
    });

    return this;
  }

  allowSorts(fields: string[]): this {
    this.sorts = fields;

    const sortParam = this.query.sort;
    if (!sortParam) return this;

    const sortFields = sortParam.split(",");

    sortFields.forEach((field: string) => {
      const order: "ASC" | "DESC" = field.startsWith("-") ? "DESC" : "ASC";
      const cleanField = field.replace(/^-/, "");

      if (this.sorts.includes(cleanField)) {
        this.qb.addOrderBy(`${this.alias}.${cleanField}`, order);
      }
    });

    return this;
  }

  allowIncludes(relations: string[]): this {
    this.includes = relations;

    const includes = (this.query.include || "").split(",").filter(Boolean);

    includes.forEach((relation: string) => {
      if (this.includes.includes(relation)) {
        this.qb.leftJoinAndSelect(`${this.alias}.${relation}`, relation);
      }
    });

    return this;
  }

  allowFields(fields: string[]): this {
    this.fields = fields;

    const selected = (this.query.fields || "")
      .split(",")
      .filter((f: string) => this.fields.includes(f));

    if (selected.length > 0) {
      this.qb.select(selected.map((f: string) => `${this.alias}.${f}`));
    }

    return this;
  }

  async get(): Promise<{ data: T[] }> {
    const data = await this.qb.getMany();
    return { data };
  }

  async paginate(): Promise<{ data: T[]; meta?: any }> {
    if (!this.isPaginated) return this.get();

    const page = parseInt(this.query.page || "1", 10);
    const perPage = parseInt(this.query.limit || "15", 10);
    const offset = (page - 1) * perPage;

    const [data, total] = await this.qb
      .skip(offset)
      .take(perPage)
      .getManyAndCount();

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

  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.qb;
  }
}
