/**
 * Femo Mail utilities for username handling and suggestion generation
 */

export class FemoMailUtils {
    static readonly FEMO_DOMAIN = 'femo.com';

    /**
     * Format Femo Mail from username
     * @param username Username without domain
     * @returns Formatted email (username@femo.com)
     */
    static formatEmail(username: string): string {
        return `${username}@${this.FEMO_DOMAIN}`;
    }

    /**
     * Extract username from Femo Mail
     * @param femoMail Full email (username@femo.com)
     * @returns Just the username part
     */
    static extractUsername(femoMail: string): string {
        return femoMail.replace(`@${this.FEMO_DOMAIN}`, '');
    }

    /**
     * Validate Femo Mail format
     * @param email Email to validate
     * @returns true if valid Femo Mail format
     */
    static isValidFormat(email: string): boolean {
        const regex = /^[a-zA-Z0-9_.-]+@femo\.com$/;
        return regex.test(email);
    }

    /**
     * Generate suggestions for Femo Mail based on base username
     * @param baseUsername Base username provided by user
     * @param existingEmails Array of already taken Femo Mails to avoid
     * @returns Array of 5 suggestion strings
     */
    static generateSuggestions(baseUsername: string, existingEmails: string[] = []): string[] {
        const suggestions: string[] = [];
        const sanitized = this.sanitizeUsername(baseUsername);
        const existingSet = new Set(existingEmails);

        // Suggestion 1: Base username as-is (if available)
        const suggestion1 = this.formatEmail(sanitized);
        if (!existingSet.has(suggestion1) && suggestion1 !== this.formatEmail(baseUsername)) {
            suggestions.push(suggestion1);
        }

        // Suggestion 2: Base with underscore and random number
        let suggestion2 = this.formatEmail(`${sanitized}_${Math.floor(Math.random() * 100)}`);
        while (existingSet.has(suggestion2) && suggestions.length < 5) {
            suggestion2 = this.formatEmail(`${sanitized}_${Math.floor(Math.random() * 1000)}`);
        }
        if (!existingSet.has(suggestion2)) suggestions.push(suggestion2);

        // Suggestion 3: Base with 'x' suffix
        let suggestion3 = this.formatEmail(`${sanitized}x`);
        while (existingSet.has(suggestion3) && suggestions.length < 5) {
            suggestion3 = this.formatEmail(`${sanitized}${Math.floor(Math.random() * 10)}`);
        }
        if (!existingSet.has(suggestion3)) suggestions.push(suggestion3);

        // Suggestion 4: Base with dot separator and last initial repeated
        let suggestion4 = this.formatEmail(`${sanitized}.${sanitized[sanitized.length - 1]}`);
        while (existingSet.has(suggestion4) && suggestions.length < 5) {
            suggestion4 = this.formatEmail(`${sanitized}${Math.floor(Math.random() * 10000)}`);
        }
        if (!existingSet.has(suggestion4)) suggestions.push(suggestion4);

        // Suggestion 5: Base with underscore and date suffix
        const timestamp = Math.floor(Math.random() * 10000);
        let suggestion5 = this.formatEmail(`${sanitized}${timestamp}`);
        while (existingSet.has(suggestion5) && suggestions.length < 5) {
            suggestion5 = this.formatEmail(`${sanitized}${Math.floor(Math.random() * 100000)}`);
        }
        if (!existingSet.has(suggestion5)) suggestions.push(suggestion5);

        return suggestions.slice(0, 5);
    }

    /**
     * Sanitize username for Femo Mail compatibility
     * Removes invalid characters
     * @param username Username to sanitize
     * @returns Sanitized username
     */
    private static sanitizeUsername(username: string): string {
        // Allow only alphanumeric, dots, underscores, and hyphens
        return username
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, '')
            .replace(/^[._-]+|[._-]+$/g, '') // Remove leading/trailing special chars
            .substring(0, 50); // Max 50 chars for username part
    }

    /**
     * Check if username is available
     * @param username Username to check
     * @param existingEmails Array of taken Femo Mails
     * @returns true if available
     */
    static isUsernameAvailable(username: string, existingEmails: string[]): boolean {
        const email = this.formatEmail(username);
        return !existingEmails.includes(email);
    }
}
