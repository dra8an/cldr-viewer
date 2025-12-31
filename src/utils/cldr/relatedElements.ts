/**
 * CLDR Related Elements Finder - Find related elements in the locale data
 */

import type { XMLNode } from '../../types/xml.types';

export interface RelatedElement {
  label: string;
  value: string;
  path: string;
  node: XMLNode;
}

/**
 * Find related elements for a given node
 */
export function findRelatedElements(node: XMLNode, rootNode: XMLNode): RelatedElement[] {
  const related: RelatedElement[] = [];
  const path = node.path.toLowerCase();
  const name = node.name?.toLowerCase();

  // Find alternate forms (abbreviated, narrow, wide)
  if (name === 'month' || name === 'day' || name === 'quarter' || name === 'era') {
    const alternates = findAlternateForms(node, rootNode);
    related.push(...alternates);
  }

  // Find siblings with same parent but different type attribute
  if (node.attributes?.type) {
    const siblings = findSiblings(node, rootNode);
    related.push(...siblings);
  }

  // Find parent context
  const parent = findParentContext(node, rootNode);
  if (parent) {
    related.push(parent);
  }

  return related;
}

/**
 * Find alternate forms (abbreviated, narrow, wide, short)
 */
function findAlternateForms(node: XMLNode, rootNode: XMLNode): RelatedElement[] {
  const related: RelatedElement[] = [];
  const pathParts = node.path.split('/');

  // Check if current path contains a context type (format/stand-alone)
  // and width type (abbreviated/narrow/wide)
  const contextIndex = pathParts.findIndex(part =>
    part.toLowerCase().includes('format') || part.toLowerCase().includes('standalone')
  );

  if (contextIndex === -1) return related;

  const currentContext = pathParts[contextIndex];
  const widthIndex = contextIndex + 1;

  if (widthIndex >= pathParts.length) return related;

  const currentWidth = pathParts[widthIndex];
  const alternateWidths = ['abbreviated', 'narrow', 'wide', 'short'];

  // Try to find nodes with different widths
  for (const width of alternateWidths) {
    if (width.toLowerCase() === currentWidth.toLowerCase()) continue;

    const alternatePath = [...pathParts];
    alternatePath[widthIndex] = width;
    const alternatePathStr = alternatePath.join('/');

    // Search for this path in the tree
    const alternateNode = findNodeByPath(rootNode, alternatePathStr);
    if (alternateNode && alternateNode.textContent) {
      related.push({
        label: `${capitalize(width)} form`,
        value: alternateNode.textContent,
        path: alternateNode.path,
        node: alternateNode
      });
    }
  }

  return related;
}

/**
 * Find sibling nodes (same parent, different type)
 */
function findSiblings(node: XMLNode, rootNode: XMLNode): RelatedElement[] {
  const related: RelatedElement[] = [];
  const type = node.attributes?.type;

  if (!type) return related;

  // Get parent path
  const pathParts = node.path.split('/');
  const parentPath = pathParts.slice(0, -1).join('/');

  // Find parent node
  const parentNode = findNodeByPath(rootNode, parentPath);
  if (!parentNode || !parentNode.children) return related;

  // Find siblings with same name but different type
  const siblings = parentNode.children.filter(child =>
    child.name === node.name &&
    child.id !== node.id &&
    child.attributes?.type &&
    child.attributes.type !== type &&
    child.textContent
  );

  // Limit to 5 siblings to avoid overwhelming the UI
  siblings.slice(0, 5).forEach(sibling => {
    const siblingType = sibling.attributes?.type || '';
    related.push({
      label: `${capitalize(siblingType)}`,
      value: sibling.textContent || '',
      path: sibling.path,
      node: sibling
    });
  });

  return related;
}

/**
 * Find parent context information
 */
function findParentContext(node: XMLNode, rootNode: XMLNode): RelatedElement | null {
  const pathParts = node.path.split('/');

  if (pathParts.length < 2) return null;

  const parentPath = pathParts.slice(0, -1).join('/');
  const parentNode = findNodeByPath(rootNode, parentPath);

  if (!parentNode) return null;

  // Only return parent if it has meaningful content or attributes
  if (parentNode.textContent) {
    return {
      label: `Parent: ${parentNode.name || 'Unknown'}`,
      value: parentNode.textContent,
      path: parentNode.path,
      node: parentNode
    };
  }

  return null;
}

/**
 * Find a node by its path
 */
function findNodeByPath(node: XMLNode, targetPath: string): XMLNode | null {
  // Normalize paths for comparison
  const normalize = (p: string) => p.toLowerCase().replace(/\[(\d+)\]/g, '');

  if (normalize(node.path) === normalize(targetPath)) {
    return node;
  }

  if (!node.children) return null;

  for (const child of node.children) {
    const found = findNodeByPath(child, targetPath);
    if (found) return found;
  }

  return null;
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if a node has related elements worth showing
 */
export function hasRelatedElements(node: XMLNode, rootNode: XMLNode): boolean {
  const related = findRelatedElements(node, rootNode);
  return related.length > 0;
}
