/**
 * Password validation utilities for frontend
 */

export interface PasswordStrength {
  score: number; // 0-5
  feedback: string;
  isValid: boolean;
}

export class PasswordValidator {
  /**
   * Validates password against global rules:
   * - Minimum 8 characters
   * - Must contain uppercase
   * - Must contain lowercase
   * - Must contain number
   * - Must contain special character
   */
  static isValid(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  }

  /**
   * Calculates password strength (0-5 scale)
   */
  static calculateStrength(password: string): PasswordStrength {
    let score = 0;


    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    const strengthLevels = {
      0: { label: 'Very Weak', color: '#ef4444' },
      1: { label: 'Weak', color: '#f97316' },
      2: { label: 'Fair', color: '#eab308' },
      3: { label: 'Good', color: '#84cc16' },
      4: { label: 'Strong', color: '#22c55e' },
      5: { label: 'Very Strong', color: '#16a34a' },
    };

    const level = Math.min(score, 5);

    return {
      score: level,
      feedback: strengthLevels[level as keyof typeof strengthLevels].label,
      isValid: this.isValid(password),
    };
  }

  /**
   * Validates passwords match
   */
  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Get password validation error message
   */
  static getValidationMessage(): string {
    return 'Password must contain at least 8 characters including uppercase, lowercase, number and special character';
  }

  /**
   * Get visual feedback for missing requirements
   */
  static getMissingRequirements(password: string): string[] {
    const missing: string[] = [];
    if (password.length < 8) missing.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) missing.push('Uppercase letter');
    if (!/[a-z]/.test(password)) missing.push('Lowercase letter');
    if (!/\d/.test(password)) missing.push('Number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) missing.push('Special character');
    return missing;
  }
}
