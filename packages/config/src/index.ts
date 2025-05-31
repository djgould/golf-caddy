// @repo/config - Shared configuration management for Golf Caddy
import { z } from 'zod';
import dotenv from 'dotenv';

export const ConfigVersion = '0.0.0';

// Load environment variables
dotenv.config();

// Base environment schema
const EnvironmentSchema = z.enum(['development', 'test', 'staging', 'production']);
export type Environment = z.infer<typeof EnvironmentSchema>;

// Database configuration schema
export const DatabaseConfigSchema = z.object({
  url: z.string().url().optional(),
  host: z.string().optional(),
  port: z.number().optional(),
  database: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  ssl: z.boolean().default(false),
});
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

// API configuration schema
export const ApiConfigSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().default(30000),
  retries: z.number().default(3),
  headers: z.record(z.string()).optional(),
});
export type ApiConfig = z.infer<typeof ApiConfigSchema>;

// AI/LLM configuration schema
export const AIConfigSchema = z.object({
  openaiApiKey: z.string().optional(),
  model: z.string().default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().optional(),
});
export type AIConfig = z.infer<typeof AIConfigSchema>;

// Feature flags schema
export const FeatureFlagsSchema = z.object({
  enableOfflineMode: z.boolean().default(true),
  enableAIAssistant: z.boolean().default(true),
  enableSocialFeatures: z.boolean().default(false),
  enablePremiumFeatures: z.boolean().default(false),
});
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

// Main application config schema
export const AppConfigSchema = z.object({
  environment: EnvironmentSchema,
  appName: z.string().default('Golf Caddy'),
  version: z.string(),
  logLevel: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),
  database: DatabaseConfigSchema.optional(),
  api: ApiConfigSchema.optional(),
  ai: AIConfigSchema.optional(),
  features: FeatureFlagsSchema.default({}),
});
export type AppConfig = z.infer<typeof AppConfigSchema>;

// Config loader class
export class ConfigLoader<T extends z.ZodSchema> {
  private schema: T;
  private config: z.infer<T> | null = null;

  constructor(schema: T) {
    this.schema = schema;
  }

  load(data: unknown): z.infer<T> {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      throw new Error(`Configuration validation failed: ${result.error.message}`);
    }

    this.config = result.data;
    return this.config;
  }

  get(): z.infer<T> {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.');
    }
    return this.config;
  }

  validate(data: unknown): boolean {
    return this.schema.safeParse(data).success;
  }
}

// Environment-specific config loaders
export const createConfigFromEnv = (): Partial<AppConfig> => {
  return {
    environment: (process.env.NODE_ENV as Environment) || 'development',
    appName: process.env.APP_NAME || 'Golf Caddy',
    version: process.env.APP_VERSION || '0.0.0',
    logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) || 'info',
    database: process.env.DATABASE_URL
      ? {
          url: process.env.DATABASE_URL,
          ssl: false,
        }
      : undefined,
    api: process.env.API_BASE_URL
      ? {
          baseUrl: process.env.API_BASE_URL,
          timeout: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : 30000,
          retries: 3,
        }
      : undefined,
    ai: process.env.OPENAI_API_KEY
      ? {
          openaiApiKey: process.env.OPENAI_API_KEY,
          model: process.env.AI_MODEL || 'gpt-4',
          temperature: 0.7,
        }
      : undefined,
  };
};

// Default config instance
export const defaultConfig = new ConfigLoader(AppConfigSchema);

// Helper to get typed config
export const getConfig = (): AppConfig => {
  return defaultConfig.get();
};

// Helper to load config from environment
export const loadConfigFromEnv = (): AppConfig => {
  const envConfig = createConfigFromEnv();
  return defaultConfig.load(envConfig);
};

// Export all types and schemas
export * from 'zod';
