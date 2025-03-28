import { Module, DynamicModule, Global } from "@nestjs/common";
import { QueryBuilderGlobalConfig } from "./types/lib-types";

@Global()
@Module({})
export class QueryBuilderModule {
  static forRoot(config: QueryBuilderGlobalConfig = {}): DynamicModule {
    return {
      module: QueryBuilderModule,
      providers: [
        {
          provide: "DYNAMIC_QUERY_CONFIG",
          useValue: config,
        },
      ],
      exports: ["DYNAMIC_QUERY_CONFIG"],
    };
  }
}
