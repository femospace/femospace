/**
 * Password validation and strength checking utilities
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
    const feedback: string[] = [];

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) {
      feedback.push('Weak - Add more character variety');
    } else if (score <= 3) {
      feedback.push('Fair - Consider using special characters');
    } else if (score <= 4) {
      feedback.push('Good - Strong password');
    } else {
      feedback.push('Strong - Excellent password');
    }

    return {
      score: Math.min(score, 5),
      feedback: feedback.join('. '),
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
}
