/**
 * Frontend password validation and strength utilities
 */

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

export interface PasswordStrengthResult {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
  strength: 'weak' | 'fair' | 'good' | 'very-strong';
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < PASSWORD_MIN_LENGTH) {
    feedback.push(`Minimum ${PASSWORD_MIN_LENGTH} characters`);
  } else {
    score++;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    feedback.push(`Maximum ${PASSWORD_MAX_LENGTH} characters`);
  }

  // Uppercase
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Add uppercase letter');
  }

  // Lowercase
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Add lowercase letter');
  }

  // Digit
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Add number');
  }

  // Special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    feedback.push('Add special character');
  }

  const strengthMap: Record<number, 'weak' | 'fair' | 'good' | 'very-strong'> = {
    0: 'weak',
    1: 'weak',
    2: 'fair',
    3: 'good',
    4: 'very-strong',
  };

  return {
    score: Math.min(score, 4),
    feedback,
    isValid: feedback.length === 0,
    strength: strengthMap[Math.min(score, 4)] || 'weak',
  };
}

/**
 * Get password strength label
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
 * Get password strength color
 */
export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-emerald-500';
    default:
      return 'bg-slate-500';
  }
}

/**
 * Check if password is valid (all requirements met)
 */
export function isValidPassword(password: string): boolean {
  return validatePassword(password).isValid;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generic validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || !value.trim()) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }
  return { valid: true };
}
