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

  if (!value) {
    return null;
  }

  // Date/Time Patterns
  if ((name === 'pattern' || name === 'dateformatitem') && path.includes('/dates/')) {
    return generateDatePatternPreview(value);
  }

  // Date/Time Skeletons
  if (name === 'datetimeskeleton' && path.includes('/dates/')) {
    return generateDateSkeletonPreview(value);
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
  try {
    // Check if this is a datetime combining pattern (contains {0} and {1})
    if (pattern.includes('{0}') && pattern.includes('{1}')) {
      // {1} = date part, {0} = time part
      const exampleDate = 'January 15, 2024';
      const exampleTime = '2:30 PM';
      const combined = pattern.replace('{1}', exampleDate).replace('{0}', exampleTime);

      return {
        examples: [combined],
        explanation: 'Combined date and time pattern ({1} = date, {0} = time)'
      };
    }

    // Use placeholder-based replacement to avoid conflicts
    // Step 1: Replace pattern symbols with unique placeholders
    let preview = pattern;

    const replacements: Array<[RegExp, string]> = [
      // Longest patterns first
      [/EEEE/g, '{{DAYNAME_FULL}}'],
      [/EEE/g, '{{DAYNAME_SHORT}}'],
      [/MMMM/g, '{{MONTH_FULL}}'],
      [/MMM/g, '{{MONTH_SHORT}}'],
      [/yyyy/g, '{{YEAR_FULL}}'],
      [/yy/g, '{{YEAR_SHORT}}'],
      [/MM/g, '{{MONTH_NUM2}}'],
      [/dd/g, '{{DAY_NUM2}}'],
      [/HH/g, '{{HOUR24_2}}'],
      [/hh/g, '{{HOUR12_2}}'],
      [/mm/g, '{{MINUTE_2}}'],
      [/ss/g, '{{SECOND_2}}'],
      // Single letter patterns (less common, only if not already replaced)
      [/(?<![A-Za-z])y(?![A-Za-z])/g, '{{YEAR}}'],
      [/(?<![A-Za-z])M(?![A-Za-z])/g, '{{MONTH}}'],
      [/(?<![A-Za-z])d(?![A-Za-z])/g, '{{DAY}}'],
      [/(?<![A-Za-z])H(?![A-Za-z])/g, '{{HOUR24}}'],
      [/(?<![A-Za-z])h(?![A-Za-z])/g, '{{HOUR12}}'],
      [/(?<![A-Za-z])m(?![A-Za-z])/g, '{{MINUTE}}'],
      [/(?<![A-Za-z])s(?![A-Za-z])/g, '{{SECOND}}'],
      [/(?<![A-Za-z])a(?![A-Za-z])/g, '{{AMPM}}'],
    ];

    // Apply all pattern replacements
    for (const [pattern, placeholder] of replacements) {
      preview = preview.replace(pattern, placeholder);
    }

    // Step 2: Replace placeholders with actual values
    const values: Record<string, string> = {
      '{{DAYNAME_FULL}}': 'Monday',
      '{{DAYNAME_SHORT}}': 'Mon',
      '{{MONTH_FULL}}': 'January',
      '{{MONTH_SHORT}}': 'Jan',
      '{{MONTH_NUM2}}': '01',
      '{{MONTH}}': '1',
      '{{YEAR_FULL}}': '2024',
      '{{YEAR_SHORT}}': '24',
      '{{YEAR}}': '2024',
      '{{DAY_NUM2}}': '15',
      '{{DAY}}': '15',
      '{{HOUR24_2}}': '14',
      '{{HOUR24}}': '14',
      '{{HOUR12_2}}': '02',
      '{{HOUR12}}': '2',
      '{{MINUTE_2}}': '30',
      '{{MINUTE}}': '30',
      '{{SECOND_2}}': '00',
      '{{SECOND}}': '0',
      '{{AMPM}}': 'PM',
    };

    for (const [placeholder, value] of Object.entries(values)) {
      preview = preview.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }

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
 * Generate preview for date/time skeletons
 */
function generateDateSkeletonPreview(skeleton: string): PreviewResult {
  // Skeletons are simplified pattern formats like "yMMMd", "yMd", "Hms", etc.
  // Convert to readable examples
  const examples: string[] = [];

  // Check what components are in the skeleton
  const hasYear = /y/.test(skeleton);
  const hasMonth = /M/.test(skeleton);
  const hasDay = /d/.test(skeleton);
  const hasWeekday = /E/.test(skeleton);
  const hasHour = /[Hh]/.test(skeleton);
  const hasMinute = /m/.test(skeleton);
  const hasSecond = /s/.test(skeleton);

  // Build example based on components
  if (hasYear && hasMonth && hasDay && hasWeekday) {
    examples.push('Monday, January 15, 2024');
  } else if (hasYear && hasMonth && hasDay) {
    examples.push('January 15, 2024');
  } else if (hasMonth && hasDay) {
    examples.push('January 15');
  } else if (hasYear && hasMonth) {
    examples.push('January 2024');
  }

  if (hasHour && hasMinute && hasSecond) {
    examples.push('2:30:00 PM');
  } else if (hasHour && hasMinute) {
    examples.push('2:30 PM');
  }

  // If no examples were generated, show the skeleton itself
  if (examples.length === 0) {
    examples.push(`Skeleton format: ${skeleton}`);
  }

  return {
    examples,
    explanation: 'Date/time skeleton pattern (flexible format)'
  };
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
