/**
 * Hook for handling XML file upload and validation
 */

import { useState, useCallback } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { useXML } from '../context/XMLContext';
import { MAX_FILE_SIZE } from '../utils/xmlParser';

/**
 * Return type for useXMLFile hook
 */
interface UseXMLFileReturn {
  /** Whether a drag operation is currently active */
  isDragging: boolean;
  /** Handler for drag enter event */
  handleDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  /** Handler for drag over event */
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  /** Handler for drag leave event */
  handleDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  /** Handler for drop event */
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  /** Handler for file input change */
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Programmatically load a file */
  loadFile: (file: File) => Promise<void>;
}

/**
 * Hook for handling XML file uploads with drag-and-drop support
 */
export function useXMLFile(): UseXMLFileReturn {
  const { loadXMLFile } = useXML();
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Validate file before loading
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.xml')) {
      return {
        valid: false,
        error: 'Invalid file type. Please select an XML file (.xml)',
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / 1024 / 1024;
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      return {
        valid: false,
        error: `File size (${fileSizeMB}MB) exceeds maximum limit of ${maxSizeMB}MB`,
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'File is empty',
      };
    }

    return { valid: true };
  }, []);

  /**
   * Load a file (with validation)
   */
  const loadFile = useCallback(
    async (file: File): Promise<void> => {
      const validation = validateFile(file);

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      await loadXMLFile(file);
    },
    [loadXMLFile, validateFile]
  );

  /**
   * Handle file input change
   */
  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        loadFile(file).catch((error) => {
          console.error('Error loading file:', error);
        });
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [loadFile]
  );

  /**
   * Handle drag enter
   */
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragging to false if we're leaving the drop zone entirely
    // Check if the related target is not a child of the current target
    const target = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;

    if (!relatedTarget || !target.contains(relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  /**
   * Handle drop
   */
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        loadFile(file).catch((error) => {
          console.error('Error loading file:', error);
        });
      }
    },
    [loadFile]
  );

  return {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    loadFile,
  };
}
