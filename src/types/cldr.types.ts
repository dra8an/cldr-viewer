/**
 * CLDR-specific type definitions
 */

/**
 * Represents a CLDR locale with metadata
 */
export interface CLDRLocale {
  /** Locale ID (e.g., "en_US", "fr_FR") */
  id: string;

  /** Language code (e.g., "en", "fr", "zh") */
  language: string;

  /** Optional script code (e.g., "Hans", "Cyrl") */
  script?: string;

  /** Optional territory/region code (e.g., "US", "GB", "CN") */
  territory?: string;

  /** Human-readable display name */
  displayName: string;

  /** XML file name (e.g., "en_US.xml") */
  fileName: string;

  /** Raw GitHub URL to fetch the file */
  url: string;
}

/**
 * GitHub API directory entry
 */
export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'file' | 'dir';
}

/**
 * Parsed locale ID components
 */
export interface LocaleComponents {
  language: string;
  script?: string;
  territory?: string;
}

/**
 * User preferences for locales
 */
export interface LocalePreferences {
  /** List of favorite locale IDs */
  favorites: string[];

  /** Recently accessed locale IDs (max 10) */
  recent: string[];
}

/**
 * CLDR metadata extracted from XML
 */
export interface CLDRMetadata {
  /** CLDR version */
  version?: string;

  /** Locale identity */
  identity?: {
    language?: string;
    script?: string;
    territory?: string;
    variant?: string;
  };

  /** Sections present in the file */
  sections: {
    localeDisplayNames: boolean;
    characters: boolean;
    dates: boolean;
    numbers: boolean;
    currencies: boolean;
    units: boolean;
    listPatterns: boolean;
    collations: boolean;
    posix: boolean;
  };
}
