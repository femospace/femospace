/**
 * Identifier type detection utility for Femo Space login
 * Determines if input is femoId (numeric) or femoMail (email)
 */

export enum IdentifierType {
  FEMO_ID = 'femoId',
  FEMO_MAIL = 'femoMail',
  INVALID = 'invalid',
}

/**
 * Detects the type of identifier
 * @param identifier - User input (femoId or femoMail)
 * @returns IdentifierType enum
 */
export function detectIdentifierType(identifier: string): IdentifierType {
  if (!identifier || typeof identifier !== 'string') {
    return IdentifierType.INVALID;
  }

  const trimmed = identifier.trim();

  // Check if it's numeric (femoId)
  if (/^\d+$/.test(trimmed)) {
    return IdentifierType.FEMO_ID;
  }

  // Check if it's valid email format (femoMail)
  if (isValidFemoMail(trimmed)) {
    return IdentifierType.FEMO_MAIL;
  }

  return IdentifierType.INVALID;
}

/**
 * Validates Femo Mail format
 * @param email - Email to validate
 * @returns boolean
 */
export function isValidFemoMail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Femo ID format
 * @param femoId - Numeric ID to validate
 * @returns boolean
 */
export function isValidFemoId(femoId: string | number): boolean {
  const numStr = String(femoId).trim();
  return /^\d+$/.test(numStr) && numStr.length > 0;
}

/**
 * Sanitizes identifier input
 * @param identifier - Raw user input
 * @returns Sanitized identifier
 */
export function sanitizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

/**
 * Gets MongoDB query filter based on identifier type
 * @param identifier - User input
 * @returns MongoDB filter object or null if invalid
 */
export function getIdentifierQueryFilter(
  identifier: string,
): { femoId: number } | { femoMail: string } | null {
  const type = detectIdentifierType(identifier);
  const sanitized = sanitizeIdentifier(identifier);

  switch (type) {
    case IdentifierType.FEMO_ID:
      return { femoId: parseInt(sanitized, 10) };

    case IdentifierType.FEMO_MAIL:
      return { femoMail: sanitized };

    case IdentifierType.INVALID:
    default:
      return null;
  }
}

/**
 * Validates identifier with detailed error message
 * @param identifier - User input
 * @returns { valid: boolean; error?: string }
 */
export function validateIdentifier(identifier: string): {
  valid: boolean;
  error?: string;
  type?: IdentifierType;
} {
  if (!identifier || identifier.trim().length === 0) {
    return {
      valid: false,
      error: 'Identifier cannot be empty',
    };
  }

  const type = detectIdentifierType(identifier);

  if (type === IdentifierType.INVALID) {
    return {
      valid: false,
      error: 'Please enter a valid Femo ID (numbers only) or Femo Mail (email format)',
      type,
    };
  }

  return {
    valid: true,
    type,
  };
}
