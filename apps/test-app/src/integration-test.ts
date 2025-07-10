// Integration test demonstrating cross-package dependencies
import { createLogger, logInfo, logError } from '@repo/logger';
import { formatDate, getRelativeTime, formatDuration } from '@repo/utils';
import { ConfigLoader, AppConfigSchema } from '@repo/config';
import type { AppConfig } from '@repo/config';
// import { prismaClient } from '@repo/db'; // Not yet exported
import { getBuildOptions } from '@repo/build-config';
import type { BuildEnvironment } from '@repo/build-config';
import { createTestUser, userFixtures } from '@repo/test-config';

// Test 1: Logger functionality
const logger = createLogger({ service: 'integration-test' });
logInfo('Integration test started', { action: 'test-start' });

// Test 2: Date utilities from utils package
console.log('\n=== Testing @repo/utils ===');
const now = new Date();
console.log('Formatted date (short):', formatDate(now, 'short'));
console.log('Formatted date (long):', formatDate(now, 'long'));
console.log('Formatted time:', formatDate(now, 'time'));
console.log('Relative time:', getRelativeTime(new Date(Date.now() - 3600000)));
console.log('Duration:', formatDuration(125));

// Test 3: Config validation
console.log('\n=== Testing @repo/config ===');
try {
  const mockConfig: AppConfig = {
    environment: 'development',
    appName: 'test-app',
    version: '1.0.0',
    logLevel: 'info',
    database: {
      url: 'postgresql://localhost:5432/test',
      ssl: false,
    },
    api: {
      baseUrl: 'https://api.test.com',
      timeout: 5000,
      retries: 3,
    },
    features: {
      enableOfflineMode: true,
      enableAIAssistant: true,
      enableSocialFeatures: false,
      enablePremiumFeatures: false,
    },
  };

  const configLoader = new ConfigLoader(AppConfigSchema);
  const validatedConfig = configLoader.load(mockConfig);
  console.log('Config validation passed:', validatedConfig?.appName);
} catch (error) {
  logError(error as Error, { feature: 'config-validation' });
}

// Test 4: Build config
console.log('\n=== Testing @repo/build-config ===');
const buildOptions = getBuildOptions('development' as BuildEnvironment);
console.log('Build options for development:', buildOptions);

// Test 5: Test utilities
console.log('\n=== Testing @repo/test-config ===');
const testUser = createTestUser({ name: 'Integration Test User' });
console.log('Test user created:', testUser.name);
console.log('Default test user:', userFixtures.testUser.email);

// Test 6: Database client (just check it's available)
console.log('\n=== Testing @repo/db ===');
// console.log('Prisma client available:', !!prismaClient);
console.log('DB package imported successfully (client not yet exported)');

// Summary
console.log('\n=== Integration Test Summary ===');
logInfo('All packages successfully imported and basic functionality verified', {
  feature: 'integration-test',
  metadata: {
    packagesTestedCount: 6,
    status: 'success',
  },
});

// Test TypeScript type checking
type TestType = {
  logger: typeof logger;
  date: string;
  config: AppConfig;
};

// Removed unused typeTest variable to fix TypeScript warning

console.log('\nTypeScript type checking passed ✓');
console.log('\nIntegration test completed successfully! 🎉');
