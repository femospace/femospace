/**
 * Password validation and strength utilities for Femo Space
 */

export interface PasswordStrengthResult {
  score: number; // 0-4: weak to very strong
  feedback: string[];
  isValid: boolean;
}

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Validates password against security requirements
 * Rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character (!@#$%^&*)
 */
export function validatePassword(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < PASSWORD_MIN_LENGTH) {
    feedback.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  } else {
    score++;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    feedback.push(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters`);
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Digit check
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain at least one digit');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  return {
    score: Math.min(score, 4),
    feedback,
    isValid: feedback.length === 0,
  };
}

/**
 * Gets password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Very Strong';
    default:
      return 'Unknown';
  }
}

/**
 * Checks if password meets minimum requirements
 */
export function isPasswordValid(password: string): boolean {
  return validatePassword(password).isValid;
}
