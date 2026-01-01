/**
 * XML Context for managing application state
 */

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { XMLNode, XMLContextValue } from '../types/xml.types';
import { parseXMLString } from '../utils/xmlParser';
import { fetchLocaleById } from '../services/cldrService';

/**
 * XML Context
 */
const XMLContext = createContext<XMLContextValue | undefined>(undefined);

/**
 * Props for XMLProvider
 */
interface XMLProviderProps {
  children: ReactNode;
}

/**
 * XML Provider Component
 */
export function XMLProvider({ children }: XMLProviderProps) {
  const [xmlData, setXmlData] = useState<XMLNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<XMLNode | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const navigationCallbackRef = useRef<((nodeName: string) => void) | null>(null);

  /**
   * Load and parse an XML file
   */
  const loadXMLFile = useCallback(async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.xml')) {
        throw new Error('Please select an XML file (.xml extension)');
      }

      // Read file content
      const text = await file.text();

      // Parse XML
      const result = parseXMLString(text);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error('Failed to parse XML file');
      }

      // Update state
      setXmlData(result.data);
      setFileName(file.name);
      setSelectedNode(null); // Clear selection when loading new file
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setXmlData(null);
      setFileName(null);
      setSelectedNode(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load and parse XML from a URL
   */
  const loadFromURL = useCallback(async (url: string, fileName?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch XML content from URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch XML: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();

      // Parse XML
      const result = parseXMLString(text);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error('Failed to parse XML from URL');
      }

      // Update state
      setXmlData(result.data);
      setFileName(fileName || url.split('/').pop() || 'remote.xml');
      setSelectedNode(null); // Clear selection when loading new file
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setXmlData(null);
      setFileName(null);
      setSelectedNode(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a node in the tree
   */
  const selectNode = useCallback((node: XMLNode | null) => {
    setSelectedNode(node);
  }, []);

  /**
   * Navigate to a node by name (called by external components)
   */
  const navigateToNode = useCallback((nodeName: string) => {
    if (navigationCallbackRef.current) {
      navigationCallbackRef.current(nodeName);
    }
  }, []);

  /**
   * Register navigation callback (called by TreePanel)
   */
  const registerNavigationCallback = useCallback((callback: (nodeName: string) => void) => {
    navigationCallbackRef.current = callback;
  }, []);

  /**
   * Clear all XML data and reset state
   */
  const clearXML = useCallback(() => {
    setXmlData(null);
    setSelectedNode(null);
    setFileName(null);
    setError(null);
    setIsLoading(false);
    setEditMode(false); // Reset edit mode when clearing
  }, []);

  /**
   * Toggle edit mode on/off
   */
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  /**
   * Auto-load default locale (en.xml) on mount
   */
  useEffect(() => {
    const autoLoadDefault = async () => {
      try {
        const xmlContent = await fetchLocaleById('en');
        const result = parseXMLString(xmlContent);

        if (result.data && !result.error) {
          setXmlData(result.data);
          setFileName('en.xml');
        }
      } catch (err) {
        // Silently fail - user can still manually load files
        console.warn('Failed to auto-load default locale:', err);
      }
    };

    autoLoadDefault();
  }, []);

  const value: XMLContextValue = {
    // State
    xmlData,
    selectedNode,
    fileName,
    isLoading,
    error,
    editMode,
    // Actions
    loadXMLFile,
    loadFromURL,
    selectNode,
    navigateToNode,
    registerNavigationCallback,
    clearXML,
    toggleEditMode,
  };

  return <XMLContext.Provider value={value}>{children}</XMLContext.Provider>;
}

/**
 * Hook to use XML context
 * @throws Error if used outside XMLProvider
 */
export function useXML(): XMLContextValue {
  const context = useContext(XMLContext);

  if (context === undefined) {
    throw new Error('useXML must be used within an XMLProvider');
  }

  return context;
}
