/**
 * XML Context for managing application state
 */

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { XMLNode, XMLContextValue, NodeModification, UndoAction } from '../types/xml.types';
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
  const [modifications, setModifications] = useState<Map<string, NodeModification>>(new Map());
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction[]>([]);
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
      setModifications(new Map()); // Clear modifications when loading new file
      setUndoStack([]); // Clear undo stack
      setRedoStack([]); // Clear redo stack
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
      setModifications(new Map()); // Clear modifications when loading new file
      setUndoStack([]); // Clear undo stack
      setRedoStack([]); // Clear redo stack
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
    setModifications(new Map()); // Clear modifications when clearing
    setUndoStack([]); // Clear undo stack
    setRedoStack([]); // Clear redo stack
  }, []);

  /**
   * Toggle edit mode on/off
   */
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  /**
   * Recursively update a node's text content in the tree
   */
  const updateNodeInTree = useCallback((node: XMLNode, nodeId: string, newValue: string): XMLNode => {
    if (node.id === nodeId) {
      return { ...node, textContent: newValue };
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeInTree(child, nodeId, newValue))
      };
    }

    return node;
  }, []);

  /**
   * Update node text content
   */
  const updateNodeText = useCallback((nodeId: string, newValue: string) => {
    if (!xmlData) return;

    // Find the node to get current and original values
    const findNode = (node: XMLNode): XMLNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    const targetNode = findNode(xmlData);
    if (!targetNode) return;

    const currentValue = targetNode.textContent || '';

    // Don't update if value hasn't changed
    if (currentValue === newValue) return;

    // Get the original value from modifications map, or use current if not modified
    const existingModification = modifications.get(nodeId);
    const originalValue = existingModification?.originalValue ?? currentValue;

    // Add to undo stack
    const undoAction: UndoAction = {
      type: 'modify',
      nodeId,
      previousValue: currentValue,
      newValue,
      timestamp: new Date()
    };
    setUndoStack(prev => [...prev, undoAction]);
    setRedoStack([]); // Clear redo stack on new action

    // Only track if value actually changed from original
    if (newValue !== originalValue) {
      // Create modification record
      const modification: NodeModification = {
        nodeId,
        originalValue,
        newValue,
        timestamp: new Date(),
        type: 'textContent',
        path: targetNode.path,
        nodeName: targetNode.name
      };

      // Update modifications map
      setModifications(prev => {
        const updated = new Map(prev);
        updated.set(nodeId, modification);
        return updated;
      });
    } else {
      // Value returned to original, remove modification
      setModifications(prev => {
        const updated = new Map(prev);
        updated.delete(nodeId);
        return updated;
      });
    }

    // Update the XML tree
    const updatedTree = updateNodeInTree(xmlData, nodeId, newValue);
    setXmlData(updatedTree);

    // Update selected node if it's the one being edited
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, textContent: newValue });
    }
  }, [xmlData, selectedNode, modifications, updateNodeInTree]);

  /**
   * Check if a node has been modified
   */
  const isNodeModified = useCallback((nodeId: string): boolean => {
    return modifications.has(nodeId);
  }, [modifications]);

  /**
   * Get modification for a node
   */
  const getNodeModification = useCallback((nodeId: string): NodeModification | undefined => {
    return modifications.get(nodeId);
  }, [modifications]);

  /**
   * Discard all modifications
   */
  const discardAllModifications = useCallback(() => {
    if (!xmlData) return;

    // Revert all modifications to their original values
    modifications.forEach((mod) => {
      const updatedTree = updateNodeInTree(xmlData, mod.nodeId, mod.originalValue);
      setXmlData(updatedTree);

      // Update selected node if needed
      if (selectedNode?.id === mod.nodeId) {
        setSelectedNode({ ...selectedNode, textContent: mod.originalValue });
      }
    });

    // Clear all tracking
    setModifications(new Map());
    setUndoStack([]);
    setRedoStack([]);
  }, [xmlData, selectedNode, modifications, updateNodeInTree]);

  /**
   * Revert a specific modification to its original value
   */
  const revertModification = useCallback((nodeId: string) => {
    if (!xmlData) return;

    const modification = modifications.get(nodeId);
    if (!modification) return;

    const currentValue = (() => {
      const findNode = (node: XMLNode): XMLNode | null => {
        if (node.id === nodeId) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(xmlData);
      return node?.textContent || '';
    })();

    // Add to undo stack
    const undoAction: UndoAction = {
      type: 'revert',
      nodeId,
      previousValue: currentValue,
      newValue: modification.originalValue,
      timestamp: new Date()
    };
    setUndoStack(prev => [...prev, undoAction]);
    setRedoStack([]); // Clear redo stack

    // Remove from modifications
    setModifications(prev => {
      const updated = new Map(prev);
      updated.delete(nodeId);
      return updated;
    });

    // Update the tree with original value
    const updatedTree = updateNodeInTree(xmlData, nodeId, modification.originalValue);
    setXmlData(updatedTree);

    // Update selected node if needed
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, textContent: modification.originalValue });
    }
  }, [xmlData, selectedNode, modifications, updateNodeInTree]);

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (!xmlData || undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];

    // Revert the change
    const updatedTree = updateNodeInTree(xmlData, lastAction.nodeId, lastAction.previousValue);
    setXmlData(updatedTree);

    // Update selected node if needed
    if (selectedNode?.id === lastAction.nodeId) {
      setSelectedNode({ ...selectedNode, textContent: lastAction.previousValue });
    }

    // Update modifications map
    const findNode = (node: XMLNode, nodeId: string): XMLNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, nodeId);
          if (found) return found;
        }
      }
      return null;
    };

    setModifications(prev => {
      const updated = new Map(prev);
      const existingMod = updated.get(lastAction.nodeId);

      if (existingMod) {
        const originalValue = existingMod.originalValue;

        // If reverting to original, remove from modifications
        if (lastAction.previousValue === originalValue) {
          updated.delete(lastAction.nodeId);
        } else {
          // Update the modification with the previous value
          const targetNode = findNode(updatedTree, lastAction.nodeId);
          updated.set(lastAction.nodeId, {
            ...existingMod,
            newValue: lastAction.previousValue,
            timestamp: new Date(),
            path: targetNode?.path,
            nodeName: targetNode?.name
          });
        }
      }

      return updated;
    });

    // Move action to redo stack
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);
  }, [xmlData, selectedNode, undoStack, updateNodeInTree]);

  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    if (!xmlData || redoStack.length === 0) return;

    const lastUndone = redoStack[redoStack.length - 1];

    // Re-apply the change
    const updatedTree = updateNodeInTree(xmlData, lastUndone.nodeId, lastUndone.newValue);
    setXmlData(updatedTree);

    // Update selected node if needed
    if (selectedNode?.id === lastUndone.nodeId) {
      setSelectedNode({ ...selectedNode, textContent: lastUndone.newValue });
    }

    // Update modifications map
    const findNode = (node: XMLNode, nodeId: string): XMLNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, nodeId);
          if (found) return found;
        }
      }
      return null;
    };

    setModifications(prev => {
      const updated = new Map(prev);
      const existingMod = updated.get(lastUndone.nodeId);

      if (existingMod) {
        const originalValue = existingMod.originalValue;

        // If new value equals original, remove from modifications
        if (lastUndone.newValue === originalValue) {
          updated.delete(lastUndone.nodeId);
        } else {
          // Update the modification with the new value
          const targetNode = findNode(updatedTree, lastUndone.nodeId);
          updated.set(lastUndone.nodeId, {
            ...existingMod,
            newValue: lastUndone.newValue,
            timestamp: new Date(),
            path: targetNode?.path,
            nodeName: targetNode?.name
          });
        }
      } else {
        // Redoing might recreate a modification
        const targetNode = findNode(updatedTree, lastUndone.nodeId);
        if (targetNode) {
          updated.set(lastUndone.nodeId, {
            nodeId: lastUndone.nodeId,
            originalValue: lastUndone.previousValue,
            newValue: lastUndone.newValue,
            timestamp: new Date(),
            type: 'textContent',
            path: targetNode.path,
            nodeName: targetNode.name
          });
        }
      }

      return updated;
    });

    // Move action back to undo stack
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastUndone]);
  }, [xmlData, selectedNode, redoStack, updateNodeInTree]);

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
    modifications,
    undoStack,
    redoStack,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    // Actions
    loadXMLFile,
    loadFromURL,
    selectNode,
    navigateToNode,
    registerNavigationCallback,
    clearXML,
    toggleEditMode,
    updateNodeText,
    isNodeModified,
    getNodeModification,
    discardAllModifications,
    revertModification,
    undo,
    redo,
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
