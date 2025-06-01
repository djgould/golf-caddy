import { config } from 'dotenv';

// Load environment variables
config();

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
    credentials: true,
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/golf_caddy',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
} as const;

export const isDevelopment = serverConfig.nodeEnv === 'development';
export const isProduction = serverConfig.nodeEnv === 'production';
