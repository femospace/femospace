/**
 * Frontend identifier detection and validation utilities
 * Mirrors backend logic for consistent validation
 */

export enum IdentifierType {
  FEMO_ID = 'femoId',
  FEMO_MAIL = 'femoMail',
  INVALID = 'invalid',
}

/**
 * Detects the type of identifier on the frontend
 * @param identifier - User input
 * @returns IdentifierType
 */
export function detectIdentifierType(identifier: string): IdentifierType {
  if (!identifier || typeof identifier !== 'string') {
    return IdentifierType.INVALID;
  }

  const trimmed = identifier.trim();

  // Check if numeric (femoId)
  if (/^\d+$/.test(trimmed)) {
    return IdentifierType.FEMO_ID;
  }

  // Check if valid email format (femoMail)
  if (isValidFemoMail(trimmed)) {
    return IdentifierType.FEMO_MAIL;
  }

  return IdentifierType.INVALID;
}

/**
 * Validates Femo Mail format (email)
 */
export function isValidFemoMail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Femo ID format
 */
export function isValidFemoId(femoId: string | number): boolean {
  const numStr = String(femoId).trim();
  return /^\d+$/.test(numStr) && numStr.length > 0;
}

/**
 * Sanitizes identifier input
 */
export function sanitizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

/**
 * Gets a human-readable identifier type label
 */
export function getIdentifierTypeLabel(type: IdentifierType): string {
  switch (type) {
    case IdentifierType.FEMO_ID:
      return 'Femo ID';
    case IdentifierType.FEMO_MAIL:
      return 'Femo Mail';
    case IdentifierType.INVALID:
    default:
      return 'Invalid';
  }
}
