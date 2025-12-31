/**
 * XML parsing utilities using fast-xml-parser
 */

import { XMLParser } from 'fast-xml-parser';
import type { XMLNode, ParseResult, XMLParserOptions } from '../types/xml.types';

/**
 * Maximum file size: 10MB
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Default parser configuration for fast-xml-parser
 */
const defaultParserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  preserveOrder: true,
  parseAttributeValue: false,
  trimValues: true,
  ignoreDeclaration: false,
  ignorePiTags: false,
  commentPropName: '#comment',
  cdataPropName: '#cdata',
  processEntities: true,
  parseTagValue: false,
};

/**
 * Counter for generating unique node IDs
 */
let nodeIdCounter = 0;

/**
 * Reset the node ID counter (useful for testing)
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * Generate a unique ID for a node
 */
function generateNodeId(): string {
  return `node_${++nodeIdCounter}`;
}

/**
 * Build XPath-like path for a node
 */
function buildPath(parentPath: string, nodeName: string, index: number = 0): string {
  const indexSuffix = index > 0 ? `[${index}]` : '';
  return parentPath === '/' ? `/${nodeName}${indexSuffix}` : `${parentPath}/${nodeName}${indexSuffix}`;
}

/**
 * Convert fast-xml-parser output to our XMLNode structure
 */
function convertToXMLNode(
  parsedData: any,
  parentPath: string = '',
  parentId?: string,
  nameCounter: Map<string, number> = new Map()
): XMLNode | null {
  if (!parsedData || typeof parsedData !== 'object') {
    return null;
  }

  // Handle array of nodes (preserveOrder: true returns arrays)
  if (Array.isArray(parsedData)) {
    // For root level, create a virtual root if multiple top-level elements
    if (parsedData.length > 1 && parentPath === '') {
      const rootId = generateNodeId();
      const children = parsedData
        .map((item) => convertToXMLNode(item, '/', rootId, new Map()))
        .filter((node): node is XMLNode => node !== null);

      return {
        id: rootId,
        name: 'root',
        type: 'element',
        path: '/',
        children: children.length > 0 ? children : undefined,
        parentId,
      };
    }

    // Single root element
    if (parsedData.length === 1) {
      return convertToXMLNode(parsedData[0], parentPath, parentId, nameCounter);
    }

    return null;
  }

  // Get the tag name (first key that's not an attribute or special property)
  const keys = Object.keys(parsedData);
  const tagNameKey = keys.find(
    (key) => !key.startsWith('@_') && !key.startsWith('#') && !key.startsWith('?') && !key.startsWith(':@')
  );

  if (!tagNameKey) {
    return null;
  }

  const nodeData = parsedData[tagNameKey];
  const nodeId = generateNodeId();

  // Calculate index for this node name
  const currentCount = nameCounter.get(tagNameKey) || 0;
  nameCounter.set(tagNameKey, currentCount + 1);
  const nodePath = buildPath(parentPath || '/', tagNameKey, currentCount);

  // Extract attributes from the parsedData object (sibling to the element key)
  const attributes: Record<string, string> = {};
  if (parsedData[':@']) {
    const attrsObj = parsedData[':@'];
    if (typeof attrsObj === 'object') {
      Object.entries(attrsObj).forEach(([key, value]) => {
        if (key.startsWith('@_')) {
          const attrName = key.substring(2); // Remove @_ prefix
          attributes[attrName] = String(value);
        }
      });
    }
  }

  // Process children and text content
  let textContent: string | undefined;
  let children: XMLNode[] | undefined;

  if (Array.isArray(nodeData)) {
    const childNodes: XMLNode[] = [];
    const childNameCounter = new Map<string, number>();

    nodeData.forEach((item) => {
      if (typeof item === 'object') {
        const itemKeys = Object.keys(item);

        // Handle text content
        if (itemKeys.includes('#text')) {
          const text = String(item['#text']).trim();
          if (text) {
            textContent = textContent ? `${textContent} ${text}` : text;
          }
        }

        // Handle CDATA
        if (itemKeys.includes('#cdata')) {
          const cdata = String(item['#cdata']);
          childNodes.push({
            id: generateNodeId(),
            name: 'CDATA',
            type: 'cdata',
            textContent: cdata,
            path: `${nodePath}/cdata()`,
            parentId: nodeId,
          });
        }

        // Handle comments - skip them (don't display in tree)
        // if (itemKeys.includes('#comment')) {
        //   const comment = String(item['#comment']);
        //   childNodes.push({
        //     id: generateNodeId(),
        //     name: 'Comment',
        //     type: 'comment',
        //     textContent: comment,
        //     path: `${nodePath}/comment()`,
        //     parentId: nodeId,
        //   });
        // }

        // Handle child elements
        itemKeys.forEach((key) => {
          if (!key.startsWith('@_') && !key.startsWith('#') && !key.startsWith('?') && !key.startsWith(':@')) {
            // Include :@ attributes if they exist for this child element
            const childData: any = { [key]: item[key] };
            if (item[':@']) {
              childData[':@'] = item[':@'];
            }
            const childNode = convertToXMLNode(
              childData,
              nodePath,
              nodeId,
              childNameCounter
            );
            if (childNode) {
              childNodes.push(childNode);
            }
          }
        });
      }
    });

    if (childNodes.length > 0) {
      children = childNodes;
    }
  } else if (typeof nodeData === 'string' || typeof nodeData === 'number') {
    textContent = String(nodeData).trim();
  }

  const node: XMLNode = {
    id: nodeId,
    name: tagNameKey,
    type: 'element',
    path: nodePath,
    parentId,
  };

  if (Object.keys(attributes).length > 0) {
    node.attributes = attributes;
  }

  if (textContent) {
    node.textContent = textContent;
  }

  if (children) {
    node.children = children;
  }

  return node;
}

/**
 * Parse XML string into XMLNode structure
 */
export function parseXMLString(xmlString: string, options?: XMLParserOptions): ParseResult {
  try {
    // Reset counter for consistent IDs
    resetNodeIdCounter();

    // Validate input
    if (!xmlString || xmlString.trim().length === 0) {
      return {
        data: null,
        error: 'XML content is empty',
      };
    }

    // Check file size if provided
    const maxSize = options?.maxFileSize || MAX_FILE_SIZE;
    if (xmlString.length > maxSize) {
      return {
        data: null,
        error: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`,
      };
    }

    // Configure parser
    const parserConfig = {
      ...defaultParserOptions,
      ignoreAttributes: options?.ignoreAttributes ?? defaultParserOptions.ignoreAttributes,
      preserveOrder: options?.preserveOrder ?? defaultParserOptions.preserveOrder,
      trimValues: options?.trimValues ?? defaultParserOptions.trimValues,
    };

    // Parse XML
    const parser = new XMLParser(parserConfig);
    const parsed = parser.parse(xmlString);


    // Convert to our XMLNode structure
    const xmlNode = convertToXMLNode(parsed);

    if (!xmlNode) {
      return {
        data: null,
        error: 'Failed to parse XML structure',
      };
    }

    return {
      data: xmlNode,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    return {
      data: null,
      error: `XML parsing failed: ${errorMessage}`,
    };
  }
}

/**
 * Validate if a string is valid XML
 */
export function isValidXML(xmlString: string): boolean {
  try {
    const parser = new XMLParser(defaultParserOptions);
    parser.parse(xmlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find a node by ID in the XML tree
 */
export function findNodeById(root: XMLNode | null, nodeId: string): XMLNode | null {
  if (!root) return null;
  if (root.id === nodeId) return root;

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, nodeId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a node by path in the XML tree
 */
export function findNodeByPath(root: XMLNode | null, path: string): XMLNode | null {
  if (!root) return null;
  if (root.path === path) return root;

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeByPath(child, path);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Get all ancestor paths for a given node
 */
export function getAncestorPaths(node: XMLNode): string[] {
  const paths: string[] = [];
  const pathParts = node.path.split('/').filter(Boolean);

  let currentPath = '';
  for (const part of pathParts) {
    currentPath += `/${part}`;
    paths.push(currentPath);
  }

  return paths;
}
