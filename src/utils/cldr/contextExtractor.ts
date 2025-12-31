/**
 * CLDR Context Extractor - Provides contextual information about CLDR elements
 */

import type { XMLNode } from '../../types/xml.types';

export interface CLDRContext {
  description: string;
  usage: string;
  category: string;
  ldmlSpec?: string;
  examples?: string[];
}

/**
 * Extract CLDR context information for a node
 */
export function extractCLDRContext(node: XMLNode): CLDRContext | null {
  const path = node.path.toLowerCase();
  const name = node.name?.toLowerCase();
  const type = node.attributes?.type;

  // Dates Section
  if (path.includes('/dates/')) {
    if (name === 'month') {
      const monthNum = type ? parseInt(type) : 0;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return {
        description: `Month name for ${monthNames[monthNum - 1] || 'month ' + type}`,
        usage: 'Used in date formatting when displaying month names in various contexts (standalone, in dates, etc.)',
        category: 'Date & Time',
        ldmlSpec: '3.6.2',
        examples: [`${monthNames[monthNum - 1] || 'Month'} 15, 2024`, `15 ${monthNames[monthNum - 1] || 'Month'} 2024`]
      };
    }

    if (name === 'day') {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayTypes: Record<string, string> = {
        'mon': 'Monday', 'tue': 'Tuesday', 'wed': 'Wednesday', 'thu': 'Thursday',
        'fri': 'Friday', 'sat': 'Saturday', 'sun': 'Sunday'
      };
      const dayName = type ? dayTypes[type] || type : 'day';
      return {
        description: `Day name for ${dayName}`,
        usage: 'Used in date formatting when displaying day names in various contexts',
        category: 'Date & Time',
        ldmlSpec: '3.6.3',
        examples: [`${dayName}, January 15, 2024`, `${dayName} morning`]
      };
    }

    if (name === 'era') {
      return {
        description: 'Era designator (BC/AD, BCE/CE)',
        usage: 'Used in date formatting to indicate the era',
        category: 'Date & Time',
        ldmlSpec: '3.6.1',
        examples: ['2024 AD', '500 BC', '2024 CE']
      };
    }

    if (name === 'quarter') {
      return {
        description: `Quarter ${type || ''} name`,
        usage: 'Used in date formatting to display quarter information',
        category: 'Date & Time',
        ldmlSpec: '3.6.4',
        examples: ['Q1 2024', '1st quarter', 'First Quarter']
      };
    }

    if (name === 'dayperiod' || name === 'dayperiods') {
      return {
        description: 'Day period (AM/PM, morning/afternoon/evening/night)',
        usage: 'Used in time formatting to indicate the period of the day',
        category: 'Date & Time',
        ldmlSpec: '3.6.5',
        examples: ['10:30 AM', 'morning', 'in the evening']
      };
    }

    if (name === 'pattern' || name === 'dateformatitem') {
      return {
        description: 'Date/time formatting pattern',
        usage: 'Template for formatting dates and times according to locale conventions',
        category: 'Date & Time',
        ldmlSpec: '3.5',
        examples: ['MM/dd/yyyy', 'yyyy-MM-dd', 'EEEE, MMMM d, yyyy']
      };
    }
  }

  // Numbers Section
  if (path.includes('/numbers/')) {
    if (name === 'decimal') {
      return {
        description: 'Decimal separator character',
        usage: 'Character used to separate integer and fractional parts of numbers',
        category: 'Number Formatting',
        ldmlSpec: '4.2',
        examples: ['1.5', '3.14', '0.99']
      };
    }

    if (name === 'group') {
      return {
        description: 'Grouping separator character',
        usage: 'Character used to separate groups of digits (thousands separator)',
        category: 'Number Formatting',
        ldmlSpec: '4.2',
        examples: ['1,000', '1,000,000', '999,999.99']
      };
    }

    if (name === 'percent' || name === 'percentsign') {
      return {
        description: 'Percent sign symbol',
        usage: 'Symbol used to represent percentages',
        category: 'Number Formatting',
        ldmlSpec: '4.2',
        examples: ['50%', '99.9%', '100%']
      };
    }

    if (name === 'minus' || name === 'minussign') {
      return {
        description: 'Minus sign symbol',
        usage: 'Symbol used to indicate negative numbers',
        category: 'Number Formatting',
        ldmlSpec: '4.2',
        examples: ['-5', '-100', '-0.5']
      };
    }

    if (name === 'plus' || name === 'plussign') {
      return {
        description: 'Plus sign symbol',
        usage: 'Symbol used to indicate positive numbers (when explicitly shown)',
        category: 'Number Formatting',
        ldmlSpec: '4.2',
        examples: ['+5', '+100', '+0.5']
      };
    }

    if (name === 'pattern' && path.includes('decimal')) {
      return {
        description: 'Decimal number formatting pattern',
        usage: 'Template for formatting decimal numbers',
        category: 'Number Formatting',
        ldmlSpec: '4.1',
        examples: ['#,##0.##', '#,##0.00', '0.######']
      };
    }

    if (name === 'pattern' && path.includes('percent')) {
      return {
        description: 'Percentage formatting pattern',
        usage: 'Template for formatting percentages',
        category: 'Number Formatting',
        ldmlSpec: '4.1',
        examples: ['#,##0%', '0.00%', '#%']
      };
    }

    if (name === 'pattern' && path.includes('currency')) {
      return {
        description: 'Currency formatting pattern',
        usage: 'Template for formatting monetary amounts',
        category: 'Number Formatting',
        ldmlSpec: '4.1',
        examples: ['$#,##0.00', '#,##0.00 €', '¤#,##0.00']
      };
    }
  }

  // Currencies Section
  if (path.includes('/currencies/')) {
    if (name === 'symbol') {
      return {
        description: `Currency symbol for ${type || 'currency'}`,
        usage: 'Symbol used to represent this currency in formatted amounts',
        category: 'Currency',
        ldmlSpec: '5.1',
        examples: ['$100.00', '€50.00', '¥1000']
      };
    }

    if (name === 'displayname') {
      return {
        description: `Display name for ${type || 'currency'}`,
        usage: 'Full name of the currency used in user interfaces',
        category: 'Currency',
        ldmlSpec: '5.1',
        examples: ['US Dollar', 'Euro', 'Japanese Yen']
      };
    }
  }

  // Locale Display Names
  if (path.includes('/localedisplaynames/')) {
    if (name === 'language') {
      return {
        description: `Display name for language code ${type || ''}`,
        usage: 'Human-readable name for this language',
        category: 'Display Names',
        ldmlSpec: '7.1',
        examples: ['English', 'French', 'German']
      };
    }

    if (name === 'territory' || name === 'region') {
      return {
        description: `Display name for territory/region code ${type || ''}`,
        usage: 'Human-readable name for this country or region',
        category: 'Display Names',
        ldmlSpec: '7.2',
        examples: ['United States', 'France', 'Japan']
      };
    }

    if (name === 'script') {
      return {
        description: `Display name for script code ${type || ''}`,
        usage: 'Human-readable name for this writing system',
        category: 'Display Names',
        ldmlSpec: '7.3',
        examples: ['Latin', 'Cyrillic', 'Arabic']
      };
    }
  }

  // List Patterns
  if (path.includes('/listpatterns/')) {
    if (name === 'listpattern') {
      return {
        description: 'List formatting pattern',
        usage: 'Template for formatting lists of items (e.g., "A, B, and C")',
        category: 'List Formatting',
        ldmlSpec: '8.1',
        examples: ['A, B, and C', 'A and B', 'A, B, C, and D']
      };
    }
  }

  // Delimiters
  if (path.includes('/delimiters/')) {
    if (name === 'quotationstart') {
      return {
        description: 'Opening quotation mark',
        usage: 'Character(s) used to begin a quotation',
        category: 'Delimiters',
        ldmlSpec: '9.1',
        examples: ['"Hello"', '«Bonjour»', '„Hallo"']
      };
    }

    if (name === 'quotationend') {
      return {
        description: 'Closing quotation mark',
        usage: 'Character(s) used to end a quotation',
        category: 'Delimiters',
        ldmlSpec: '9.1',
        examples: ['"Hello"', '«Bonjour»', '„Hallo"']
      };
    }

    if (name === 'alternativequotationstart') {
      return {
        description: 'Alternative opening quotation mark',
        usage: 'Character(s) used for nested or alternative quotations',
        category: 'Delimiters',
        ldmlSpec: '9.1',
        examples: ["'nested'", '‹nested›']
      };
    }

    if (name === 'alternativequotationend') {
      return {
        description: 'Alternative closing quotation mark',
        usage: 'Character(s) used for nested or alternative quotations',
        category: 'Delimiters',
        ldmlSpec: '9.1',
        examples: ["'nested'", '‹nested›']
      };
    }
  }

  // Units
  if (path.includes('/units/')) {
    if (name === 'unitpattern' || name === 'unit') {
      return {
        description: `Unit formatting pattern for ${type || 'unit'}`,
        usage: 'Template for formatting measurements with units',
        category: 'Unit Formatting',
        ldmlSpec: '10.1',
        examples: ['5 meters', '10 km/h', '25°C']
      };
    }
  }

  // Characters
  if (path.includes('/characters/')) {
    if (name === 'exemplarcharacters') {
      return {
        description: 'Exemplar character set',
        usage: 'Set of characters commonly used in this locale',
        category: 'Characters',
        ldmlSpec: '6.1',
        examples: ['[a-z]', '[а-я]', '[一-龥]']
      };
    }
  }

  // Layout
  if (path.includes('/layout/')) {
    if (name === 'orientation') {
      return {
        description: 'Text orientation direction',
        usage: 'Specifies how text flows (left-to-right or right-to-left)',
        category: 'Layout',
        ldmlSpec: '11.1',
        examples: ['left-to-right', 'right-to-left']
      };
    }
  }

  // Generic fallback
  if (node.name) {
    return {
      description: `CLDR element: ${node.name}`,
      usage: 'Part of locale data structure',
      category: 'General',
    };
  }

  return null;
}
