/**
 * CLDR Service - Fetch and manage CLDR locale data from GitHub
 */

import type { CLDRLocale, GitHubContent, LocaleComponents } from '../types/cldr.types';

/**
 * GitHub repository configuration
 */
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';
const CLDR_REPO = 'unicode-org/cldr';
const CLDR_BRANCH = 'main';
const CLDR_MAIN_PATH = 'common/main';

/**
 * Cache keys for localStorage
 */
const CACHE_KEYS = {
  LOCALE_LIST: 'cldr_locale_list',
  LOCALE_LIST_TIMESTAMP: 'cldr_locale_list_timestamp',
  CACHE_VERSION: 'cldr_cache_version',
};

/**
 * Cache duration: 24 hours
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Cache version - increment this when display name logic changes
 */
const CACHE_VERSION = 2;

/**
 * Parse locale ID into components
 *
 * Locale ID format: language[_Script][_Territory]
 * - language: 2-3 lowercase letters (e.g., en, zh)
 * - Script: 4 letters, Title case (e.g., Latn, Cyrl, Hans)
 * - Territory: 2 uppercase letters OR 3 digits (e.g., US, GB, 001)
 */
export function parseLocaleId(localeId: string): LocaleComponents {
  const parts = localeId.split('_');

  if (parts.length === 1) {
    // Just language: en, fr, de
    return {
      language: parts[0],
      script: undefined,
      territory: undefined,
    };
  }

  if (parts.length === 2) {
    // Could be language_Script OR language_Territory
    const secondPart = parts[1];

    // Check if it's a script (4 characters, starts with uppercase)
    if (secondPart.length === 4 && /^[A-Z][a-z]{3}$/.test(secondPart)) {
      // language_Script: sr_Latn, zh_Hans
      return {
        language: parts[0],
        script: secondPart,
        territory: undefined,
      };
    }

    // Otherwise it's a territory (2 uppercase letters or 3 digits)
    // language_Territory: en_US, ar_001
    return {
      language: parts[0],
      script: undefined,
      territory: secondPart,
    };
  }

  if (parts.length === 3) {
    // language_Script_Territory: zh_Hans_CN
    return {
      language: parts[0],
      script: parts[1],
      territory: parts[2],
    };
  }

  // Fallback for unexpected formats
  return {
    language: parts[0],
    script: undefined,
    territory: undefined,
  };
}

/**
 * Generate display name from locale ID
 */
export function getLocaleDisplayName(localeId: string): string {
  const components = parseLocaleId(localeId);

  // Use Intl.DisplayNames to get language and territory names
  const languageDisplay = new Intl.DisplayNames(['en'], { type: 'language' });
  const regionDisplay = new Intl.DisplayNames(['en'], { type: 'region' });

  // Language names (basic set - can be expanded)
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

  // Script names
  const scriptNames: Record<string, string> = {
    Hans: 'Simplified',
    Hant: 'Traditional',
    Cyrl: 'Cyrillic',
    Latn: 'Latin',
    Arab: 'Arabic',
  };

  const languageName = languageNames[components.language] || components.language.toUpperCase();
  const scriptName = components.script ? scriptNames[components.script] : undefined;

  // Get territory name using Intl.DisplayNames API
  let territoryName: string | undefined;
  if (components.territory) {
    try {
      territoryName = regionDisplay.of(components.territory);
    } catch (error) {
      // Fallback to territory code if not recognized
      territoryName = components.territory;
    }
  }

  // Build display name
  let displayName = languageName;

  if (scriptName && territoryName) {
    displayName += ` (${territoryName}, ${scriptName})`;
  } else if (scriptName) {
    displayName += ` (${scriptName})`;
  } else if (territoryName) {
    displayName += ` (${territoryName})`;
  }

  return displayName;
}

/**
 * Fetch list of CLDR locales from GitHub
 */
export async function fetchLocaleList(): Promise<CLDRLocale[]> {
  // Check cache first
  const cached = getCachedLocaleList();
  if (cached) {
    return cached;
  }

  try {
    const url = `${GITHUB_API_BASE}/repos/${CLDR_REPO}/contents/${CLDR_MAIN_PATH}?ref=${CLDR_BRANCH}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const contents: GitHubContent[] = await response.json();

    // Filter for .xml files and convert to CLDRLocale
    const locales: CLDRLocale[] = contents
      .filter((item) => item.type === 'file' && item.name.endsWith('.xml'))
      .map((item) => {
        const localeId = item.name.replace('.xml', '');
        const components = parseLocaleId(localeId);

        return {
          id: localeId,
          language: components.language,
          script: components.script,
          territory: components.territory,
          displayName: getLocaleDisplayName(localeId),
          fileName: item.name,
          url: item.download_url,
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Cache the result
    cacheLocaleList(locales);

    return locales;
  } catch (error) {
    console.error('Error fetching locale list:', error);

    // Try to use cached data even if expired
    const expired = getCachedLocaleList(true);
    if (expired) {
      console.warn('Using expired cache due to fetch error');
      return expired;
    }

    throw error;
  }
}

/**
 * Fetch a specific CLDR locale file
 */
export async function fetchLocaleFile(locale: CLDRLocale): Promise<string> {
  try {
    const response = await fetch(locale.url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${locale.id}: ${response.status} ${response.statusText}`);
    }

    const xmlContent = await response.text();
    return xmlContent;
  } catch (error) {
    console.error(`Error fetching locale ${locale.id}:`, error);
    throw error;
  }
}

/**
 * Fetch locale file by ID
 */
export async function fetchLocaleById(localeId: string): Promise<string> {
  const url = `${GITHUB_RAW_BASE}/${CLDR_REPO}/${CLDR_BRANCH}/${CLDR_MAIN_PATH}/${localeId}.xml`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${localeId}: ${response.status} ${response.statusText}`);
    }

    const xmlContent = await response.text();
    return xmlContent;
  } catch (error) {
    console.error(`Error fetching locale ${localeId}:`, error);
    throw error;
  }
}

/**
 * Get cached locale list
 */
function getCachedLocaleList(ignoreExpiry: boolean = false): CLDRLocale[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.LOCALE_LIST);
    const timestamp = localStorage.getItem(CACHE_KEYS.LOCALE_LIST_TIMESTAMP);
    const cachedVersion = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);

    if (!cached || !timestamp) {
      return null;
    }

    // Check if cache version matches
    if (cachedVersion !== String(CACHE_VERSION)) {
      console.log('Cache version mismatch - clearing cache');
      clearLocaleCache();
      return null;
    }

    // Check if cache is expired
    if (!ignoreExpiry) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age > CACHE_DURATION) {
        return null;
      }
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Cache locale list
 */
function cacheLocaleList(locales: CLDRLocale[]): void {
  try {
    localStorage.setItem(CACHE_KEYS.LOCALE_LIST, JSON.stringify(locales));
    localStorage.setItem(CACHE_KEYS.LOCALE_LIST_TIMESTAMP, Date.now().toString());
    localStorage.setItem(CACHE_KEYS.CACHE_VERSION, String(CACHE_VERSION));
  } catch (error) {
    console.error('Error caching locale list:', error);
  }
}

/**
 * Clear locale list cache
 */
export function clearLocaleCache(): void {
  localStorage.removeItem(CACHE_KEYS.LOCALE_LIST);
  localStorage.removeItem(CACHE_KEYS.LOCALE_LIST_TIMESTAMP);
  localStorage.removeItem(CACHE_KEYS.CACHE_VERSION);
}

/**
 * Get common/popular locales
 */
export function getCommonLocales(): string[] {
  return [
    'en',      // English
    'en_US',   // English (United States)
    'en_GB',   // English (United Kingdom)
    'es',      // Spanish
    'es_ES',   // Spanish (Spain)
    'es_MX',   // Spanish (Mexico)
    'fr',      // French
    'fr_FR',   // French (France)
    'fr_CA',   // French (Canada)
    'de',      // German
    'de_DE',   // German (Germany)
    'it',      // Italian
    'pt',      // Portuguese
    'pt_BR',   // Portuguese (Brazil)
    'pt_PT',   // Portuguese (Portugal)
    'ru',      // Russian
    'zh',      // Chinese
    'zh_Hans', // Chinese (Simplified)
    'zh_Hant', // Chinese (Traditional)
    'ja',      // Japanese
    'ko',      // Korean
    'ar',      // Arabic
    'hi',      // Hindi
  ];
}
