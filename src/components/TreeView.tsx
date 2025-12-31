/**
 * TreeView - Tree component using react-arborist
 */

import type { MouseEvent } from 'react';
import { Tree } from 'react-arborist';
import type { NodeRendererProps } from 'react-arborist';
import { ChevronRight, ChevronDown, FileText, MessageSquare, Code } from 'lucide-react';
import { useXML } from '../context/XMLContext';
import type { XMLNode } from '../types/xml.types';
import clsx from 'clsx';

/**
 * Get icon for node type
 */
function getNodeIcon(node: XMLNode) {
  switch (node.type) {
    case 'element':
      return FileText;
    case 'comment':
      return MessageSquare;
    case 'cdata':
      return Code;
    default:
      return FileText;
  }
}

/**
 * Format node as XML opening tag
 */
function formatXMLTag(xmlNode: XMLNode): string {
  const nodeName = xmlNode.name;

  if (!xmlNode.attributes || Object.keys(xmlNode.attributes).length === 0) {
    return `<${nodeName}>`;
  }

  const attributesStr = Object.entries(xmlNode.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `<${nodeName} ${attributesStr}>`;
}

/**
 * Custom node renderer
 */
function NodeRenderer({ node, style, dragHandle }: NodeRendererProps<XMLNode>) {
  const { selectNode, selectedNode } = useXML();
  const xmlNode = node.data;
  const Icon = getNodeIcon(xmlNode);
  const isSelected = selectedNode?.id === xmlNode.id;
  const xmlTag = formatXMLTag(xmlNode);

  const handleClick = () => {
    selectNode(xmlNode);
  };

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    node.toggle();
  };

  return (
    <div
      ref={dragHandle}
      style={style}
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded transition-colors',
        isSelected && 'bg-blue-100 text-blue-900',
        !isSelected && 'hover:bg-gray-100'
      )}
    >
      {/* Expand/Collapse Arrow */}
      <span
        className="flex-shrink-0 cursor-pointer"
        onClick={handleToggle}
      >
        {node.isLeaf ? (
          <span className="w-4 h-4 inline-block" />
        ) : node.isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </span>

      {/* Node Icon */}
      <Icon className="w-4 h-4 flex-shrink-0 text-gray-500" />

      {/* XML Tag */}
      <span className="text-sm truncate flex-1 min-w-0 font-mono text-gray-700 dark:text-gray-300">
        {xmlTag}
      </span>
    </div>
  );
}

/**
 * TreeView Component Props
 */
interface TreeViewProps {
  /** Height of the tree container */
  height?: number;
}

/**
 * TreeView Component
 */
export function TreeView({ height = 600 }: TreeViewProps) {
  const { xmlData } = useXML();

  if (!xmlData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-sm">No XML data loaded</p>
      </div>
    );
  }

  // Skip root and ldml levels for CLDR files
  let treeData: XMLNode[] = [xmlData];

  // If root node, get its children
  if (xmlData.name === 'root' && xmlData.children) {
    treeData = xmlData.children;
  }

  // If first node is ldml, show its children instead
  if (treeData.length === 1 && treeData[0].name === 'ldml' && treeData[0].children) {
    treeData = treeData[0].children;
  }

  // Filter out identity element
  treeData = treeData.filter(node => node.name !== 'identity');

  return (
    <div className="h-full">
      <Tree<XMLNode>
        data={treeData}
        openByDefault={false}
        width="100%"
        height={height}
        indent={24}
        rowHeight={32}
        overscanCount={10}
        disableDrag
        disableDrop
        idAccessor="id"
        childrenAccessor="children"
      >
        {NodeRenderer}
      </Tree>
    </div>
  );
}
