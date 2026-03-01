/**
 * Femo ID generator utility
 * Auto-generates incrementing IDs starting from 1000000
 */

export class FemoIdGenerator {
    /**
     * Generate next Femo ID based on user count
     * Formula: 1000000 + userCount
     * @param userCount Current number of users in database
     * @returns Generated Femo ID
     */
    static generate(userCount: number): number {
        const BASE_ID = 1000000;
        return BASE_ID + userCount;
    }

    /**
     * Validate if a number is a valid Femo ID
     * @param id ID to validate
     * @returns true if valid Femo ID format
     */
    static isValid(id: number): boolean {
        return id >= 1000000 && Number.isInteger(id);
    }

    /**
     * Extract user position from Femo ID
     * @param femoId Femo ID to extract from
     * @returns Original user count when ID was generated
     */
    static extractPosition(femoId: number): number {
        const BASE_ID = 1000000;
        return Math.max(0, femoId - BASE_ID);
    }
}
