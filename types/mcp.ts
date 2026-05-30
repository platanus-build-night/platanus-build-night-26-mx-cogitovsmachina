export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

export type DBForkId = Branded<string, 'DBForkId'>;
export type MemoryKey = Branded<string, 'MemoryKey'>;
export type CurrencyMXN = Branded<number, 'MXN'>;
export type RFC = Branded<string, 'RFC'>; // Mexican Tax ID Brand

export interface MCPToolDefinition<TArgs = any> {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description?: string }>;
    required?: string[];
  };
  execute: (args: TArgs) => Promise<any>;
}

export interface LatAmProcessTemplate {
  code: 'MX_CFDI_AUDIT' | 'BR_BOLETO_SYNC' | 'CL_BOLETA_EMISSION';
  country: 'Mexico' | 'Brazil' | 'Chile';
  title: string;
  description: string;
  defaultSql: string;
  validationRules: string[];
  tokenCostLimit: number;
}
