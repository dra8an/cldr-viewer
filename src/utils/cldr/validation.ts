/**
 * CLDR Validation - Basic validation for CLDR elements
 */

import type { XMLNode } from '../../types/xml.types';

export type ValidationSeverity = 'valid' | 'warning' | 'error';

export interface ValidationResult {
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
}

/**
 * Validate a CLDR node value
 */
export function validateCLDRNode(node: XMLNode): ValidationResult {
  const path = node.path.toLowerCase();
  const name = node.name?.toLowerCase();
  const value = node.textContent?.trim();

  // Check for empty values
  if (!value && node.type === 'element' && (!node.children || node.children.length === 0)) {
    return {
      severity: 'warning',
      message: 'Element has no value',
      suggestion: 'Consider adding content or removing this element'
    };
  }

  // Validate month numbers
  if (name === 'month' && path.includes('/dates/')) {
    const monthType = node.attributes?.type;
    if (monthType) {
      const monthNum = parseInt(monthType);
      if (monthNum < 1 || monthNum > 13) { // Some calendars have 13 months
        return {
          severity: 'error',
          message: `Invalid month number: ${monthNum}`,
          suggestion: 'Month type should be between 1 and 13'
        };
      }
    }
    if (value && value.length === 0) {
      return {
        severity: 'error',
        message: 'Month name cannot be empty',
        suggestion: 'Provide a name for this month'
      };
    }
  }

  // Validate day names
  if (name === 'day' && path.includes('/dates/')) {
    const dayType = node.attributes?.type;
    const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    if (dayType && !validDays.includes(dayType.toLowerCase())) {
      return {
        severity: 'warning',
        message: `Unusual day type: ${dayType}`,
        suggestion: `Expected one of: ${validDays.join(', ')}`
      };
    }
  }

  // Validate number symbols
  if (path.includes('/numbers/symbols/')) {
    if (name === 'decimal' || name === 'group') {
      if (value && value.length > 1) {
        return {
          severity: 'warning',
          message: 'Number separator is usually a single character',
          suggestion: 'Consider using a single character'
        };
      }
    }
  }

  // Validate currency codes
  if (path.includes('/currencies/currency') && node.attributes?.type) {
    const currencyCode = node.attributes.type;
    if (currencyCode.length !== 3) {
      return {
        severity: 'warning',
        message: 'Currency codes are typically 3 letters (ISO 4217)',
        suggestion: 'Verify this currency code'
      };
    }
    if (!/^[A-Z]{3}$/.test(currencyCode)) {
      return {
        severity: 'warning',
        message: 'Currency codes are usually uppercase',
        suggestion: 'Use uppercase letters for currency codes'
      };
    }
  }

  // Validate language codes
  if (name === 'language' && path.includes('/localedisplaynames/') && node.attributes?.type) {
    const langCode = node.attributes.type;
    if (langCode.length < 2 || langCode.length > 3) {
      return {
        severity: 'warning',
        message: 'Language codes are typically 2-3 characters',
        suggestion: 'Verify this language code follows ISO 639'
      };
    }
  }

  // Validate territory codes
  if ((name === 'territory' || name === 'region') && path.includes('/localedisplaynames/') && node.attributes?.type) {
    const territoryCode = node.attributes.type;
    // Territory codes are either 2 uppercase letters or 3 digits
    if (!/^[A-Z]{2}$/.test(territoryCode) && !/^\d{3}$/.test(territoryCode)) {
      return {
        severity: 'warning',
        message: 'Territory codes should be 2 uppercase letters or 3 digits',
        suggestion: 'Verify this territory code follows ISO 3166'
      };
    }
  }

  // Validate quotation marks
  if (path.includes('/delimiters/')) {
    if ((name === 'quotationstart' || name === 'quotationend') && value) {
      if (value.length > 2) {
        return {
          severity: 'warning',
          message: 'Quotation marks are usually 1-2 characters',
          suggestion: 'Verify this quotation mark is correct'
        };
      }
    }
  }

  // Validate date/time patterns
  if ((name === 'pattern' || name === 'dateformatitem') && path.includes('/dates/') && value) {
    // Check for common pattern characters
    const hasDateChars = /[yMdEDFwW]/.test(value);
    const hasTimeChars = /[hHmsaKz]/.test(value);

    if (!hasDateChars && !hasTimeChars) {
      return {
        severity: 'warning',
        message: 'Pattern does not contain common date/time symbols',
        suggestion: 'Verify this is a valid date/time pattern (e.g., y=year, M=month, d=day, H=hour, m=minute)'
      };
    }
  }

  // Validate number patterns
  if (name === 'pattern' && path.includes('/numbers/') && value) {
    if (!value.includes('#') && !value.includes('0')) {
      return {
        severity: 'warning',
        message: 'Number pattern should contain # or 0 placeholders',
        suggestion: 'Add digit placeholders (# or 0) to the pattern'
      };
    }
  }

  // Check for suspicious characters in text content
  if (value && /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value)) {
    return {
      severity: 'warning',
      message: 'Value contains control characters',
      suggestion: 'Remove non-printable characters'
    };
  }

  // All checks passed
  return {
    severity: 'valid',
    message: 'No validation issues found'
  };
}

/**
 * Get validation icon color class based on severity
 */
export function getValidationColor(severity: ValidationSeverity): string {
  switch (severity) {
    case 'valid':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get validation icon background color class based on severity
 */
export function getValidationBgColor(severity: ValidationSeverity): string {
  switch (severity) {
    case 'valid':
      return 'bg-green-50';
    case 'warning':
      return 'bg-yellow-50';
    case 'error':
      return 'bg-red-50';
    default:
      return 'bg-gray-50';
  }
}

/**
 * Get validation border color class based on severity
 */
export function getValidationBorderColor(severity: ValidationSeverity): string {
  switch (severity) {
    case 'valid':
      return 'border-green-200';
    case 'warning':
      return 'border-yellow-200';
    case 'error':
      return 'border-red-200';
    default:
      return 'border-gray-200';
  }
}
