/**
 * Locale Selector Component - Choose CLDR locales from dropdown
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Search, Star, Clock, ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';
import { fetchLocaleList, getCommonLocales } from '../services/cldrService';
import { useXML } from '../context/XMLContext';
import type { CLDRLocale } from '../types/cldr.types';

/**
 * LocaleSelector component
 */
export function LocaleSelector() {
  const { loadFromURL, fileName } = useXML();
  const [locales, setLocales] = useState<CLDRLocale[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentLocales, setRecentLocales] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load locale list on mount
  useEffect(() => {
    const loadLocales = async () => {
      try {
        const localeList = await fetchLocaleList();
        setLocales(localeList);
      } catch (error) {
        console.error('Failed to load locale list:', error);
      }
    };

    loadLocales();

    // Load favorites and recent from localStorage
    const storedFavorites = localStorage.getItem('cldr_favorites');
    const storedRecent = localStorage.getItem('cldr_recent');

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    if (storedRecent) {
      setRecentLocales(JSON.parse(storedRecent));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter locales based on search query
  const filteredLocales = useMemo(() => {
    if (!searchQuery) {
      return locales;
    }

    const query = searchQuery.toLowerCase();
    return locales.filter(
      (locale) =>
        locale.id.toLowerCase().includes(query) ||
        locale.displayName.toLowerCase().includes(query) ||
        locale.language.toLowerCase().includes(query)
    );
  }, [locales, searchQuery]);

  // Get common locales for quick access
  const commonLocales = useMemo(() => {
    const commonIds = getCommonLocales();
    return locales.filter((locale) => commonIds.includes(locale.id));
  }, [locales]);

  // Get favorite locales
  const favoriteLocales = useMemo(() => {
    return locales.filter((locale) => favorites.includes(locale.id));
  }, [locales, favorites]);

  // Get recent locales
  const recentLocalesList = useMemo(() => {
    return locales.filter((locale) => recentLocales.includes(locale.id));
  }, [locales, recentLocales]);

  /**
   * Load a locale
   */
  const loadLocale = async (locale: CLDRLocale) => {
    setIsLoading(true);
    setIsOpen(false);
    setSearchQuery('');

    try {
      // Use the URL from the locale object to load via loadFromURL
      await loadFromURL(locale.url, locale.fileName);

      // Update recent locales
      const updatedRecent = [
        locale.id,
        ...recentLocales.filter((id) => id !== locale.id),
      ].slice(0, 10);
      setRecentLocales(updatedRecent);
      localStorage.setItem('cldr_recent', JSON.stringify(updatedRecent));
    } catch (error) {
      console.error('Failed to load locale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle favorite
   */
  const toggleFavorite = (localeId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const updatedFavorites = favorites.includes(localeId)
      ? favorites.filter((id) => id !== localeId)
      : [...favorites, localeId];

    setFavorites(updatedFavorites);
    localStorage.setItem('cldr_favorites', JSON.stringify(updatedFavorites));
  };

  /**
   * Get current locale display name
   */
  const currentLocale = useMemo(() => {
    if (!fileName) return null;
    const localeId = fileName.replace('.xml', '');
    return locales.find((l) => l.id === localeId);
  }, [fileName, locales]);

  /**
   * Render locale item
   */
  const renderLocaleItem = (locale: CLDRLocale, showFavorite = true) => (
    <button
      key={locale.id}
      onClick={() => loadLocale(locale)}
      className={clsx(
        'w-full flex items-center justify-between px-3 py-2 text-sm',
        'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        'text-left group'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {locale.displayName}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{locale.id}</div>
      </div>
      {showFavorite && (
        <span
          onClick={(e) => toggleFavorite(locale.id, e)}
          className={clsx(
            'ml-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer',
            'hover:bg-gray-200 dark:hover:bg-gray-600',
            favorites.includes(locale.id) && 'opacity-100'
          )}
        >
          <Star
            size={14}
            className={clsx(
              favorites.includes(locale.id)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            )}
          />
        </span>
      )}
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-md',
          'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
          'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Globe size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {currentLocale ? currentLocale.displayName : 'Select Locale'}
        </span>
        {isLoading ? (
          <div className="ml-auto w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <ChevronDown
            size={16}
            className={clsx(
              'ml-auto text-gray-600 dark:text-gray-400 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full left-0 mt-2 w-96 max-h-[500px]',
            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
            'rounded-md shadow-lg z-50 overflow-hidden flex flex-col'
          )}
        >
          {/* Search Box */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locales..."
                className={clsx(
                  'w-full pl-9 pr-8 py-2 text-sm',
                  'bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600',
                  'rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'text-gray-900 dark:text-gray-100 placeholder-gray-400'
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Locale List */}
          <div className="overflow-y-auto flex-1">
            {/* Favorites Section */}
            {!searchQuery && favoriteLocales.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-750">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Favorites
                  </span>
                </div>
                {favoriteLocales.map((locale) => renderLocaleItem(locale))}
              </div>
            )}

            {/* Recent Section */}
            {!searchQuery && recentLocalesList.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-750">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Recent
                  </span>
                </div>
                {recentLocalesList.map((locale) => renderLocaleItem(locale))}
              </div>
            )}

            {/* Common Locales Section */}
            {!searchQuery && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Common Locales
                  </span>
                </div>
                {commonLocales.map((locale) => renderLocaleItem(locale))}
              </div>
            )}

            {/* All Locales / Search Results */}
            <div>
              {searchQuery && (
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Search Results ({filteredLocales.length})
                  </span>
                </div>
              )}
              {!searchQuery && (
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-750">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    All Locales ({locales.length})
                  </span>
                </div>
              )}
              {filteredLocales.length > 0 ? (
                filteredLocales.map((locale) => renderLocaleItem(locale))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No locales found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
