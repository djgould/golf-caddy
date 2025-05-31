// Common validation utilities

/**
 * Validate email address format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (US)
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
};

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate number is within range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate string length
 * @param str - String to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @returns True if string length is valid
 */
export const isValidLength = (str: string, minLength: number, maxLength?: number): boolean => {
  const length = str.trim().length;
  if (maxLength === undefined) {
    return length >= minLength;
  }
  return length >= minLength && length <= maxLength;
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  message?: string;
} => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true };
};
