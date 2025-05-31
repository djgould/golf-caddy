import {
  ConfigVersion,
  ConfigLoader,
  AppConfigSchema,
  DatabaseConfigSchema,
  FeatureFlagsSchema,
  createConfigFromEnv,
} from './index';

describe('@repo/config', () => {
  describe('ConfigVersion', () => {
    it('should export a version string', () => {
      expect(typeof ConfigVersion).toBe('string');
      expect(ConfigVersion).toBe('0.0.0');
    });

    it('should match the expected version format', () => {
      expect(ConfigVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('Schemas', () => {
    it('should export DatabaseConfigSchema', () => {
      expect(DatabaseConfigSchema).toBeDefined();
    });

    it('should export AppConfigSchema', () => {
      expect(AppConfigSchema).toBeDefined();
    });

    it('should export FeatureFlagsSchema', () => {
      expect(FeatureFlagsSchema).toBeDefined();
    });

    it('should validate a valid database config', () => {
      const validConfig = {
        url: 'postgresql://localhost:5432/test',
        ssl: false,
      };

      const result = DatabaseConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should validate feature flags with defaults', () => {
      const result = FeatureFlagsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.enableOfflineMode).toBe(true);
        expect(result.data.enableAIAssistant).toBe(true);
        expect(result.data.enableSocialFeatures).toBe(false);
      }
    });
  });

  describe('ConfigLoader', () => {
    it('should create a new ConfigLoader instance', () => {
      const loader = new ConfigLoader(AppConfigSchema);
      expect(loader).toBeInstanceOf(ConfigLoader);
    });

    it('should load and validate config data', () => {
      const loader = new ConfigLoader(DatabaseConfigSchema);
      const validData = {
        url: 'postgresql://localhost:5432/test',
        ssl: true,
      };

      const result = loader.load(validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid config data', () => {
      const loader = new ConfigLoader(DatabaseConfigSchema);
      const invalidData = {
        url: 'not-a-valid-url',
      };

      expect(() => loader.load(invalidData)).toThrow('Configuration validation failed');
    });

    it('should throw error when getting config before loading', () => {
      const loader = new ConfigLoader(DatabaseConfigSchema);
      expect(() => loader.get()).toThrow('Configuration not loaded');
    });

    it('should validate data correctly', () => {
      const loader = new ConfigLoader(DatabaseConfigSchema);

      const validData = { url: 'postgresql://localhost:5432/test' };
      const invalidData = { url: 'not-a-url' };

      expect(loader.validate(validData)).toBe(true);
      expect(loader.validate(invalidData)).toBe(false);
    });
  });

  describe('createConfigFromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset env vars before each test
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // Restore original env vars
      process.env = originalEnv;
    });

    it('should create config with default values', () => {
      // Clear NODE_ENV to test default behavior
      delete process.env.NODE_ENV;

      const config = createConfigFromEnv();

      expect(config.environment).toBe('development');
      expect(config.appName).toBe('Golf Caddy');
      expect(config.logLevel).toBe('info');
    });

    it('should use environment variables when available', () => {
      process.env.NODE_ENV = 'production';
      process.env.APP_NAME = 'Test App';
      process.env.LOG_LEVEL = 'debug';
      process.env.DATABASE_URL = 'postgresql://test:5432/db';

      const config = createConfigFromEnv();

      expect(config.environment).toBe('production');
      expect(config.appName).toBe('Test App');
      expect(config.logLevel).toBe('debug');
      expect(config.database?.url).toBe('postgresql://test:5432/db');
    });

    it('should handle API configuration from env vars', () => {
      process.env.API_BASE_URL = 'https://api.example.com';
      process.env.API_TIMEOUT = '5000';

      const config = createConfigFromEnv();

      expect(config.api?.baseUrl).toBe('https://api.example.com');
      expect(config.api?.timeout).toBe(5000);
      expect(config.api?.retries).toBe(3);
    });

    it('should handle AI configuration from env vars', () => {
      process.env.OPENAI_API_KEY = 'sk-test123';
      process.env.AI_MODEL = 'gpt-3.5-turbo';

      const config = createConfigFromEnv();

      expect(config.ai?.openaiApiKey).toBe('sk-test123');
      expect(config.ai?.model).toBe('gpt-3.5-turbo');
      expect(config.ai?.temperature).toBe(0.7);
    });
  });
});
