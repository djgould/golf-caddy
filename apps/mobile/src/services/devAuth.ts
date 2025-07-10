/**
 * Development Authentication Service
 * 
 * Creates a development user and handles auto-login for testing.
 * This is only used in development mode.
 */

import { AuthTokenManager, createTRPCClientConfig } from '../config/trpc';

export interface DevUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Create development user via API and get real JWT token
 */
async function createDevUserAndToken(): Promise<{ user: DevUser; token: string }> {
  try {
    const client = createTRPCClientConfig();
    const result = await client.dev.createDevUser.mutate({
      email: 'dev@golfcaddy.com',
      name: 'Development User'
    });

    return {
      user: result.user,
      token: result.token
    };
  } catch (error) {
    console.error('Failed to create dev user via API:', error);
    throw error;
  }
}

/**
 * Initialize development authentication
 */
export async function initDevAuth(): Promise<void> {
  if (!__DEV__) {
    console.warn('⚠️ Dev auth called in production mode');
    return;
  }

  try {
    // Check if we already have a token
    const existingToken = await AuthTokenManager.getToken();
    
    if (existingToken) {
      console.log('🔐 Using existing dev auth token');
      return;
    }

    console.log('🔐 Creating development user...');
    
    // Create dev user and get real JWT token from API
    const { user, token } = await createDevUserAndToken();
    await AuthTokenManager.setToken(token);
    
    console.log('🔐 Development auth initialized');
    console.log('👤 Logged in as:', user.name, `(${user.email})`);
    
  } catch (error) {
    console.error('❌ Failed to initialize dev auth:', error);
  }
}

/**
 * Clear development authentication
 */
export async function clearDevAuth(): Promise<void> {
  try {
    await AuthTokenManager.removeToken();
    console.log('🔓 Development auth cleared');
  } catch (error) {
    console.error('❌ Failed to clear dev auth:', error);
  }
}

/**
 * Get current dev user info (placeholder for now)
 */
export function getDevUser(): DevUser {
  return {
    id: 'dev-user',
    email: 'dev@golfcaddy.com',
    name: 'Development User'
  };
}