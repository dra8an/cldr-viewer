/**
 * Formatting utilities for displaying XML data
 */

import type { XMLNode } from '../types/xml.types';

/**
 * Format attributes as a readable string
 */
export function formatAttributes(attributes?: Record<string, string>): string {
  if (!attributes || Object.keys(attributes).length === 0) {
    return 'None';
  }

  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

/**
 * Format attributes as an array of key-value objects for table display
 */
export function formatAttributesForTable(
  attributes?: Record<string, string>
): Array<{ key: string; value: string }> {
  if (!attributes) {
    return [];
  }

  return Object.entries(attributes).map(([key, value]) => ({
    key,
    value,
  }));
}

/**
 * Get a shortened version of text content for display
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format text content with line breaks preserved
 */
export function formatTextContent(text?: string): string {
  if (!text) {
    return 'None';
  }

  return text.trim();
}

/**
 * Get node type display name
 */
export function getNodeTypeLabel(type: XMLNode['type']): string {
  const labels: Record<XMLNode['type'], string> = {
    element: 'Element',
    text: 'Text',
    comment: 'Comment',
    cdata: 'CDATA Section',
    'processing-instruction': 'Processing Instruction',
  };

  return labels[type] || 'Unknown';
}

/**
 * Get a display name for a node (includes tag name and key attributes)
 */
export function getNodeDisplayName(node: XMLNode): string {
  // For non-element nodes, just return the name
  if (node.type !== 'element') {
    return node.name;
  }

  // Check for common identifying attributes
  const identifyingAttrs = ['id', 'name', 'type', 'key', 'class'];
  const attrs = node.attributes;

  if (attrs) {
    for (const attrName of identifyingAttrs) {
      if (attrs[attrName]) {
        return `${node.name} [${attrName}="${truncateText(attrs[attrName], 20)}"]`;
      }
    }
  }

  // If has text content (and it's short), include it
  if (node.textContent && node.textContent.length <= 30 && !node.children?.length) {
    return `${node.name}: "${truncateText(node.textContent, 20)}"`;
  }

  return node.name;
}

/**
 * Count total number of nodes in a tree
 */
export function countNodes(node: XMLNode): number {
  let count = 1; // Count this node

  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }

  return count;
}

/**
 * Get depth of a node in the tree
 */
export function getNodeDepth(node: XMLNode): number {
  const pathParts = node.path.split('/').filter(Boolean);
  return pathParts.length;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format path for display (shorten if too long)
 */
export function formatPath(path: string, maxLength: number = 50): string {
  if (path.length <= maxLength) {
    return path;
  }

  // Show start and end of path
  const partLength = Math.floor((maxLength - 3) / 2);
  return `${path.substring(0, partLength)}...${path.substring(path.length - partLength)}`;
}

/**
 * Get node statistics
 */
export function getNodeStats(node: XMLNode): {
  totalNodes: number;
  depth: number;
  childCount: number;
  hasAttributes: boolean;
  hasTextContent: boolean;
  attributeCount: number;
} {
  return {
    totalNodes: countNodes(node),
    depth: getNodeDepth(node),
    childCount: node.children?.length || 0,
    hasAttributes: !!node.attributes && Object.keys(node.attributes).length > 0,
    hasTextContent: !!node.textContent && node.textContent.trim().length > 0,
    attributeCount: node.attributes ? Object.keys(node.attributes).length : 0,
  };
}

/**
 * Generate a summary description of a node
 */
export function getNodeSummary(node: XMLNode): string {
  const stats = getNodeStats(node);
  const parts: string[] = [];

  if (stats.attributeCount > 0) {
    parts.push(`${stats.attributeCount} attribute${stats.attributeCount !== 1 ? 's' : ''}`);
  }

  if (stats.childCount > 0) {
    parts.push(`${stats.childCount} child${stats.childCount !== 1 ? 'ren' : ''}`);
  }

  if (stats.hasTextContent && stats.childCount === 0) {
    parts.push('text content');
  }

  return parts.length > 0 ? parts.join(', ') : 'empty element';
}

/**
 * Highlight search term in text
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm || searchTerm.trim() === '') {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Convert XMLNode tree to indented string representation (for debugging/export)
 */
export function treeToString(node: XMLNode, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  let result = `${spaces}<${node.name}`;

  // Add attributes
  if (node.attributes) {
    result += ` ${formatAttributes(node.attributes)}`;
  }

  if (!node.children?.length && !node.textContent) {
    // Self-closing tag
    result += ' />\n';
  } else {
    result += '>';

    // Add text content
    if (node.textContent && !node.children?.length) {
      result += node.textContent;
    } else if (node.children?.length) {
      result += '\n';
      // Add children
      for (const child of node.children) {
        result += treeToString(child, indent + 1);
      }
      result += spaces;
    }

    result += `</${node.name}>\n`;
  }

  return result;
}
