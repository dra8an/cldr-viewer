/**
 * CLDR Value Preview - Generate formatted examples for CLDR values
 */

import type { XMLNode } from '../../types/xml.types';

export interface PreviewResult {
  examples: string[];
  explanation?: string;
}

/**
 * Generate preview examples for a CLDR node value
 */
export function generateValuePreview(node: XMLNode): PreviewResult | null {
  const path = node.path.toLowerCase();
  const name = node.name?.toLowerCase();
  const value = node.textContent?.trim();

  if (!value) return null;

  // Date/Time Patterns
  if ((name === 'pattern' || name === 'dateformatitem') && path.includes('/dates/')) {
    return generateDatePatternPreview(value);
  }

  // Number Patterns
  if (name === 'pattern' && path.includes('/numbers/')) {
    if (path.includes('decimal')) {
      return generateNumberPatternPreview(value, 'decimal');
    }
    if (path.includes('percent')) {
      return generateNumberPatternPreview(value, 'percent');
    }
    if (path.includes('currency')) {
      return generateNumberPatternPreview(value, 'currency');
    }
  }

  // Number Symbols
  if (path.includes('/numbers/symbols/')) {
    return generateNumberSymbolPreview(name || '', value);
  }

  // Month Names
  if (name === 'month' && path.includes('/dates/')) {
    const monthType = node.attributes?.type;
    const monthNum = monthType ? parseInt(monthType) : 1;
    return {
      examples: [
        `${value} 15, 2024`,
        `15 ${value} 2024`,
        `${value} 2024`
      ],
      explanation: `Month name used in date formatting for month ${monthNum}`
    };
  }

  // Day Names
  if (name === 'day' && path.includes('/dates/')) {
    return {
      examples: [
        `${value}, January 15, 2024`,
        `${value} afternoon`,
        `Next ${value}`
      ],
      explanation: 'Day name used in date and calendar displays'
    };
  }

  // Currency Symbols
  if (name === 'symbol' && path.includes('/currencies/')) {
    return {
      examples: [
        `${value}100.00`,
        `${value}1,234.56`,
        `${value}0.99`
      ],
      explanation: 'Currency symbol used in monetary formatting'
    };
  }

  // Quotation Marks
  if (path.includes('/delimiters/')) {
    if (name === 'quotationstart' || name === 'quotationend') {
      return {
        examples: [
          `${value}Hello World${value === '"' ? '"' : ''}`,
          `${value}Example text${value === '«' ? '»' : value === '"' ? '"' : ''}`
        ],
        explanation: 'Quotation marks used for quoting text'
      };
    }
  }

  // List Patterns
  if (name === 'listpattern' && path.includes('/listpatterns/')) {
    const type = node.attributes?.type;
    if (type === 'start') {
      return {
        examples: ['A, B, ...'],
        explanation: 'Pattern for the first items in a list'
      };
    }
    if (type === 'middle') {
      return {
        examples: ['..., B, C, ...'],
        explanation: 'Pattern for middle items in a list'
      };
    }
    if (type === 'end') {
      return {
        examples: ['..., and Z'],
        explanation: 'Pattern for the last item in a list'
      };
    }
    if (type === '2') {
      return {
        examples: ['A and B'],
        explanation: 'Pattern for a two-item list'
      };
    }
  }

  // Unit Patterns
  if ((name === 'unitpattern' || name === 'unit') && path.includes('/units/')) {
    // Replace {0} with example number
    const preview = value.replace(/\{0\}/g, '5');
    return {
      examples: [preview, value.replace(/\{0\}/g, '100')],
      explanation: 'Pattern for formatting measurements with units'
    };
  }

  return null;
}

/**
 * Generate preview for date/time patterns
 */
function generateDatePatternPreview(pattern: string): PreviewResult {
  const now = new Date('2024-01-15T14:30:00'); // Monday, January 15, 2024, 2:30 PM

  try {
    // Simple pattern replacement for common date/time symbols
    let preview = pattern;

    // Year
    preview = preview.replace(/yyyy/g, '2024');
    preview = preview.replace(/yy/g, '24');

    // Month
    preview = preview.replace(/MMMM/g, 'January');
    preview = preview.replace(/MMM/g, 'Jan');
    preview = preview.replace(/MM/g, '01');
    preview = preview.replace(/M/g, '1');

    // Day
    preview = preview.replace(/dd/g, '15');
    preview = preview.replace(/d/g, '15');

    // Day of week
    preview = preview.replace(/EEEE/g, 'Monday');
    preview = preview.replace(/EEE/g, 'Mon');
    preview = preview.replace(/EE/g, 'Mon');
    preview = preview.replace(/E/g, 'Mon');

    // Hour
    preview = preview.replace(/HH/g, '14');
    preview = preview.replace(/H/g, '14');
    preview = preview.replace(/hh/g, '02');
    preview = preview.replace(/h/g, '2');

    // Minute
    preview = preview.replace(/mm/g, '30');
    preview = preview.replace(/m/g, '30');

    // Second
    preview = preview.replace(/ss/g, '00');
    preview = preview.replace(/s/g, '0');

    // AM/PM
    preview = preview.replace(/a/g, 'PM');

    return {
      examples: [preview],
      explanation: 'Date/time formatted according to this pattern'
    };
  } catch (error) {
    return {
      examples: [pattern],
      explanation: 'Unable to preview this pattern'
    };
  }
}

/**
 * Generate preview for number patterns
 */
function generateNumberPatternPreview(pattern: string, type: 'decimal' | 'percent' | 'currency'): PreviewResult {
  const examples: string[] = [];

  if (type === 'decimal') {
    // Try to format example numbers using the pattern structure
    examples.push('1,234.56');
    examples.push('0.99');
    examples.push('1,000,000');
  } else if (type === 'percent') {
    examples.push('50%');
    examples.push('99.9%');
    examples.push('0.5%');
  } else if (type === 'currency') {
    // Replace currency placeholder
    const preview = pattern.replace(/¤/g, '$');
    examples.push('$100.00');
    examples.push('$1,234.56');
  }

  return {
    examples,
    explanation: `Number formatting pattern for ${type} values`
  };
}

/**
 * Generate preview for number symbols
 */
function generateNumberSymbolPreview(symbolName: string, value: string): PreviewResult | null {
  switch (symbolName) {
    case 'decimal':
      return {
        examples: [`1${value}5`, `3${value}14`, `0${value}99`],
        explanation: 'Decimal separator used in numbers'
      };

    case 'group':
      return {
        examples: [`1${value}000`, `1${value}000${value}000`],
        explanation: 'Thousands separator used in numbers'
      };

    case 'percent':
    case 'percentsign':
      return {
        examples: [`50${value}`, `99.9${value}`],
        explanation: 'Percent symbol'
      };

    case 'minus':
    case 'minussign':
      return {
        examples: [`${value}5`, `${value}100`],
        explanation: 'Minus sign for negative numbers'
      };

    case 'plus':
    case 'plussign':
      return {
        examples: [`${value}5`, `${value}100`],
        explanation: 'Plus sign for positive numbers'
      };

    default:
      return null;
  }
}
