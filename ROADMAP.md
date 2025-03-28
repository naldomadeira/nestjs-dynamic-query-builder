# ROADMAP

## nestjs-dynamic-query-builder

### ✅ Versão 1.0.0
- Filtros com operadores (`eq`, `like`, `gt`, etc)
- Ordenação dinâmica
- Includes (joins)
- Seleção de campos
- Paginação com `meta`
- `.get()` e `.paginate()` com fallback configurável
- Decoradores: `@QueryBuilder()` + `@QueryConfig()`
- Config global via `QueryBuilderModule.forRoot()`

### 🔜 Futuro
- Operadores customizáveis
- Includes aninhados
- Suporte a class-validator
- Cursor pagination
- Prisma e Mongoose (adapters futuros)
