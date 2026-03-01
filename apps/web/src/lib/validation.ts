export interface PasswordStrength {
    score: number; // 0-5
    label: string;
    color: string;
    feedback: string[];
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (!password) {
        return { score: 0, label: 'Too weak', color: 'bg-gray-300', feedback: ['Enter a password'] };
    }

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');

    if (password.length >= 12) score++;

    // Uppercase
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letter');

    // Lowercase
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letter');

    // Numbers
    if (/\d/.test(password)) score++;
    else feedback.push('Add a number');

    // Special characters
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    else feedback.push('Add a special character');

    // Return strength assessment
    if (score <= 2) {
        return { score, label: 'Weak', color: 'bg-red-500', feedback };
    } else if (score === 3) {
        return { score, label: 'Fair', color: 'bg-orange-500', feedback };
    } else if (score === 4) {
        return { score, label: 'Good', color: 'bg-yellow-500', feedback };
    } else if (score === 5) {
        return { score, label: 'Strong', color: 'bg-green-500', feedback };
    } else {
        return { score, label: 'Very Strong', color: 'bg-emerald-500', feedback };
    }
};
