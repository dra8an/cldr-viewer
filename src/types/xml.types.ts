/**
 * Type definitions for XML data structures and application state
 */

/**
 * Represents a node in the XML tree structure
 */
export interface XMLNode {
  /** Unique identifier for the node */
  id: string;

  /** Tag name or node type name */
  name: string;

  /** Type of XML node (element, text, comment, cdata, etc.) */
  type: 'element' | 'text' | 'comment' | 'cdata' | 'processing-instruction';

  /** Node attributes as key-value pairs */
  attributes?: Record<string, string>;

  /** Text content of the node (for text nodes or elements with text) */
  textContent?: string;

  /** Child nodes */
  children?: XMLNode[];

  /** XPath-like path to this node */
  path: string;

  /** Parent node ID (for navigation) */
  parentId?: string;
}

/**
 * Tree node structure for react-arborist
 */
export interface TreeNode {
  /** Unique identifier matching XMLNode.id */
  id: string;

  /** Display name for the tree */
  name: string;

  /** Child tree nodes */
  children?: TreeNode[];

  /** Reference to the full XMLNode data */
  data: XMLNode;
}

/**
 * Application state managed by XMLContext
 */
export interface XMLContextState {
  /** Parsed XML data as tree structure */
  xmlData: XMLNode | null;

  /** Currently selected node */
  selectedNode: XMLNode | null;

  /** Name of the loaded XML file */
  fileName: string | null;

  /** Loading state indicator */
  isLoading: boolean;

  /** Error message if parsing or loading fails */
  error: string | null;

  /** Whether edit mode is enabled */
  editMode: boolean;
}

/**
 * Actions available in XMLContext
 */
export interface XMLContextActions {
  /** Load and parse an XML file */
  loadXMLFile: (file: File) => Promise<void>;

  /** Load and parse XML from a URL */
  loadFromURL: (url: string, fileName?: string) => Promise<void>;

  /** Select a node in the tree */
  selectNode: (node: XMLNode | null) => void;

  /** Navigate to and expand a node by name */
  navigateToNode: (nodeName: string) => void;

  /** Register navigation callback from TreePanel */
  registerNavigationCallback: (callback: (nodeName: string) => void) => void;

  /** Clear all XML data and reset state */
  clearXML: () => void;

  /** Toggle edit mode on/off */
  toggleEditMode: () => void;
}

/**
 * Combined context value with state and actions
 */
export type XMLContextValue = XMLContextState & XMLContextActions;

/**
 * Parser configuration options
 */
export interface XMLParserOptions {
  /** Whether to preserve order of elements and attributes */
  preserveOrder?: boolean;

  /** Whether to ignore attributes */
  ignoreAttributes?: boolean;

  /** Whether to trim whitespace from text content */
  trimValues?: boolean;

  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize?: number;
}

/**
 * Parse result with potential errors
 */
export interface ParseResult {
  /** Parsed XML tree (null if error) */
  data: XMLNode | null;

  /** Error message if parsing failed */
  error: string | null;
}
