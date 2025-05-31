// Shared Metro configuration for React Native
import type { BuildEnvironment } from './index';

// Metro configuration types (simplified for our use)
export interface MetroConfig {
  resolver: {
    sourceExts: string[];
    assetExts: string[];
    nodeModulesPaths?: string[];
    extraNodeModules?: Record<string, string>;
  };
  transformer: {
    minifierConfig?: {
      mangle?: {
        keep_fnames?: boolean;
      };
      keep_fnames?: boolean;
    };
    getTransformOptions?: () => Promise<{
      transform: {
        experimentalImportSupport: boolean;
        inlineRequires: boolean;
      };
    }>;
  };
  watchFolders?: string[];
  resetCache?: boolean;
}

// Default source extensions
export const defaultSourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Default asset extensions
export const defaultAssetExts = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'ttf',
  'otf',
  'woff',
  'woff2',
  'mp3',
  'mp4',
  'mov',
  'webm',
];

/**
 * Create base Metro configuration
 */
export const createMetroConfig = (options: {
  projectRoot: string;
  watchFolders?: string[];
  env?: BuildEnvironment;
}): MetroConfig => {
  const { projectRoot, watchFolders = [], env = 'development' } = options;
  const isDevelopment = env === 'development';

  const config: MetroConfig = {
    resolver: {
      sourceExts: defaultSourceExts,
      assetExts: defaultAssetExts,
      nodeModulesPaths: [
        `${projectRoot}/node_modules`,
        `${projectRoot}/../../node_modules`, // For monorepo
      ],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: !isDevelopment,
        },
      }),
    },
    watchFolders: [projectRoot, ...watchFolders],
    resetCache: env === 'production',
  };

  // Add minifier config only for development
  if (isDevelopment) {
    config.transformer.minifierConfig = {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    };
  }

  return config;
};

/**
 * Create Metro config for monorepo setup
 */
export const createMonorepoMetroConfig = (options: {
  projectRoot: string;
  workspaceRoot: string;
  packages?: string[];
  env?: BuildEnvironment;
}): MetroConfig => {
  const { projectRoot, workspaceRoot, packages = [], env = 'development' } = options;

  // Watch folders include workspace packages
  const watchFolders = packages.map((pkg) => `${workspaceRoot}/packages/${pkg}`);

  // Extra node modules for package resolution
  const extraNodeModules: Record<string, string> = {};
  packages.forEach((pkg) => {
    extraNodeModules[`@repo/${pkg}`] = `${workspaceRoot}/packages/${pkg}`;
  });

  const config = createMetroConfig({
    projectRoot,
    watchFolders: [workspaceRoot, ...watchFolders],
    env,
  });

  // Add monorepo-specific resolver configuration
  config.resolver.extraNodeModules = extraNodeModules;

  return config;
};

/**
 * Helper to generate Metro config file content
 */
export const generateMetroConfigFile = (config: MetroConfig): string => {
  return `const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  
  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      sourceExts: ${JSON.stringify(config.resolver.sourceExts, null, 2).replace(/\n/g, '\n      ')},
      assetExts: ${JSON.stringify(config.resolver.assetExts, null, 2).replace(/\n/g, '\n      ')},
      nodeModulesPaths: ${JSON.stringify(config.resolver.nodeModulesPaths || [], null, 2).replace(/\n/g, '\n      ')},
      ${config.resolver.extraNodeModules ? `extraNodeModules: ${JSON.stringify(config.resolver.extraNodeModules, null, 2).replace(/\n/g, '\n      ')},` : ''}
    },
    transformer: {
      ...defaultConfig.transformer,
      ${config.transformer.minifierConfig ? `minifierConfig: ${JSON.stringify(config.transformer.minifierConfig, null, 2).replace(/\n/g, '\n      ')},` : ''}
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: ${config.transformer.getTransformOptions ? 'true' : 'false'},
        },
      }),
    },
    watchFolders: ${JSON.stringify(config.watchFolders || [], null, 2).replace(/\n/g, '\n    ')},
    ${config.resetCache ? 'resetCache: true,' : ''}
  };
})();
`;
};
