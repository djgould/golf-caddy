import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { prisma } from '@repo/db';
import { serverConfig } from './config';

// User type for JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Enhanced user type with database info
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extract JWT token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1] || null;
}

/**
 * Verify and decode JWT token
 */
export function verifyJwtToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, serverConfig.auth.jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
      cause: error,
    });
  }
}

/**
 * Get user from database by ID
 */
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database error while fetching user',
      cause: error,
    });
  }
}

/**
 * Authenticate user from token and return user info
 */
export async function authenticateUser(token: string): Promise<AuthUser> {
  // Verify and decode token
  const payload = verifyJwtToken(token);

  // Get user from database
  const user = await getUserById(payload.userId);

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not found',
    });
  }

  return user;
}

/**
 * Create JWT token for user (for testing/future use)
 */
export function createJwtToken(userId: string, email: string): string {
  const payload: JwtPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, serverConfig.auth.jwtSecret, {
    expiresIn: '7d', // Token expires in 7 days
  });
}
