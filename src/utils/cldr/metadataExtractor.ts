/**
 * CLDR Metadata Extractor - Extract CLDR-specific metadata from XML
 */

import type { XMLNode } from '../../types/xml.types';
import { parseLocaleId } from '../../services/cldrService';

export interface CLDRMetadata {
  localeId: string;
  language: {
    code: string;
    name: string;
  };
  territory?: {
    code: string;
    name: string;
  };
  script?: {
    code: string;
    name: string;
  };
  version?: string;
  sections: {
    name: string;
    displayName: string;
  }[];
}

/**
 * Language code to name mapping (basic set)
 */
const languageNames: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  sv: 'Swedish',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  id: 'Indonesian',
  cs: 'Czech',
  ro: 'Romanian',
  el: 'Greek',
  he: 'Hebrew',
  da: 'Danish',
  fi: 'Finnish',
  no: 'Norwegian',
  sr: 'Serbian',
  uk: 'Ukrainian',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sk: 'Slovak',
};

/**
 * Script code to name mapping
 */
const scriptNames: Record<string, string> = {
  Hans: 'Simplified',
  Hant: 'Traditional',
  Cyrl: 'Cyrillic',
  Latn: 'Latin',
  Arab: 'Arabic',
  Deva: 'Devanagari',
  Jpan: 'Japanese',
  Kore: 'Korean',
};

/**
 * CLDR section names mapping
 */
const sectionDisplayNames: Record<string, string> = {
  localeDisplayNames: 'Locale Display Names',
  dates: 'Date & Time Formats',
  numbers: 'Number Formats',
  currencies: 'Currency Data',
  units: 'Unit Formats',
  listPatterns: 'List Patterns',
  characterLabels: 'Character Labels',
  delimiters: 'Quotation Delimiters',
  layout: 'Layout Direction',
  characters: 'Character Sets',
  posix: 'POSIX Data',
  personNames: 'Person Names',
  segmentations: 'Text Segmentation',
  annotations: 'Emoji Annotations',
};

/**
 * Extract CLDR metadata from XML node
 */
export function extractCLDRMetadata(xmlData: XMLNode, fileName?: string | null): CLDRMetadata {
  // Extract locale ID from filename or identity element
  let localeId = 'unknown';
  if (fileName) {
    localeId = fileName.replace('.xml', '');
  }

  // Parse locale components
  const components = parseLocaleId(localeId);

  // Get language name
  const languageName = languageNames[components.language] || components.language.toUpperCase();

  // Get territory name using Intl.DisplayNames
  let territoryName: string | undefined;
  if (components.territory) {
    try {
      const regionDisplay = new Intl.DisplayNames(['en'], { type: 'region' });
      territoryName = regionDisplay.of(components.territory);
    } catch {
      territoryName = components.territory;
    }
  }

  // Get script name
  const scriptName = components.script ? scriptNames[components.script] : undefined;

  // Extract version from identity element
  let version: string | undefined;
  const identityNode = findNodeByName(xmlData, 'identity');
  if (identityNode) {
    const versionNode = findChildByName(identityNode, 'version');
    if (versionNode?.attributes?.number) {
      version = versionNode.attributes.number;
    }
  }

  // Find all major sections
  const sections: { name: string; displayName: string }[] = [];

  // Look for ldml node or use root
  let ldmlNode = xmlData.name === 'ldml' ? xmlData : findNodeByName(xmlData, 'ldml');
  if (!ldmlNode && xmlData.children) {
    ldmlNode = xmlData.children.find(child => child.name === 'ldml');
  }

  if (ldmlNode?.children) {
    ldmlNode.children.forEach((child) => {
      const displayName = sectionDisplayNames[child.name];
      if (displayName && child.name !== 'identity') {
        sections.push({
          name: child.name,
          displayName,
        });
      }
    });
  }

  return {
    localeId,
    language: {
      code: components.language,
      name: languageName,
    },
    territory: components.territory
      ? {
          code: components.territory,
          name: territoryName || components.territory,
        }
      : undefined,
    script: components.script
      ? {
          code: components.script,
          name: scriptName || components.script,
        }
      : undefined,
    version,
    sections,
  };
}

/**
 * Find a node by name recursively
 */
function findNodeByName(node: XMLNode, name: string): XMLNode | null {
  if (node.name === name) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByName(child, name);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Find a direct child by name
 */
function findChildByName(node: XMLNode, name: string): XMLNode | null {
  if (!node.children) {
    return null;
  }

  return node.children.find((child) => child.name === name) || null;
}
