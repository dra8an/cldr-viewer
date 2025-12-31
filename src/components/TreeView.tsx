/**
 * TreeView - Tree component using react-arborist
 */

import type { MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import { Tree } from 'react-arborist';
import type { NodeRendererProps, TreeApi } from 'react-arborist';
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
 * Format node as XML opening tag with color-coded parts
 */
function formatXMLTag(xmlNode: XMLNode, isLeaf: boolean): JSX.Element {
  const nodeName = xmlNode.name;
  const hasAttributes = xmlNode.attributes && Object.keys(xmlNode.attributes).length > 0;

  // For leaf elements, don't show < > tags
  if (isLeaf) {
    if (!hasAttributes) {
      return <span className="text-blue-600">{nodeName}</span>;
    }

    return (
      <>
        <span className="text-blue-600">{nodeName}</span>
        {' '}
        {Object.entries(xmlNode.attributes!).map(([key, value], index) => (
          <span key={key}>
            {index > 0 && ' '}
            <span className="text-teal-600">{key}</span>
            <span className="text-teal-600">="</span>
            <span className="text-teal-600">{value}</span>
            <span className="text-teal-600">"</span>
          </span>
        ))}
      </>
    );
  }

  // For non-leaf elements, show with < > tags
  if (!hasAttributes) {
    return (
      <>
        <span className="text-gray-500">&lt;</span>
        <span className="text-blue-600">{nodeName}</span>
        <span className="text-gray-500">&gt;</span>
      </>
    );
  }

  return (
    <>
      <span className="text-gray-500">&lt;</span>
      <span className="text-blue-600">{nodeName}</span>
      {' '}
      {Object.entries(xmlNode.attributes!).map(([key, value], index) => (
        <span key={key}>
          {index > 0 && ' '}
          <span className="text-teal-600">{key}</span>
          <span className="text-teal-600">="</span>
          <span className="text-teal-600">{value}</span>
          <span className="text-teal-600">"</span>
        </span>
      ))}
      <span className="text-gray-500">&gt;</span>
    </>
  );
}

/**
 * Custom node renderer
 */
function NodeRenderer({ node, style, dragHandle }: NodeRendererProps<XMLNode>) {
  const { selectNode, selectedNode } = useXML();
  const xmlNode = node.data;
  const Icon = getNodeIcon(xmlNode);
  const isSelected = selectedNode?.id === xmlNode.id;
  const xmlTag = formatXMLTag(xmlNode, node.isLeaf);

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
      <span className="text-sm truncate flex-1 min-w-0 font-mono">
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
  const { xmlData, registerNavigationCallback, selectNode } = useXML();
  const treeApiRef = useRef<TreeApi<XMLNode> | null>(null);

  // Register navigation callback
  useEffect(() => {
    const navigateToNode = (nodeName: string) => {
      if (!treeApiRef.current) return;

      // Find the node with the given name
      const findNode = (nodes: XMLNode[], name: string): XMLNode | null => {
        for (const node of nodes) {
          if (node.name === name) {
            return node;
          }
          if (node.children) {
            const found = findNode(node.children, name);
            if (found) return found;
          }
        }
        return null;
      };

      if (!xmlData) return;

      let searchNodes: XMLNode[] = [xmlData];

      // Apply the same filtering as tree data
      if (xmlData.name === 'root' && xmlData.children) {
        searchNodes = xmlData.children;
      }
      if (searchNodes.length === 1 && searchNodes[0].name === 'ldml' && searchNodes[0].children) {
        searchNodes = searchNodes[0].children;
      }
      searchNodes = searchNodes.filter(node => node.name !== 'identity');

      const targetNode = findNode(searchNodes, nodeName);
      if (targetNode) {
        // Open the node
        treeApiRef.current.open(targetNode.id);

        // Select the node
        selectNode(targetNode);

        // Wait for the tree to render, then scroll
        setTimeout(() => {
          if (treeApiRef.current) {
            // Use the built-in scrollTo to get the node into view
            treeApiRef.current.scrollTo(targetNode.id);

            // Then find the scrollable container and adjust position to top
            setTimeout(() => {
              // Find the scrollable element - it's typically a div with overflow
              const treeElement = document.querySelector('[role="tree"]');
              if (treeElement) {
                const scrollContainer = treeElement.querySelector('div[style*="overflow"]') as HTMLElement;
                if (scrollContainer) {
                  // Find the selected node element
                  const selectedNode = scrollContainer.querySelector('.bg-blue-100');
                  if (selectedNode) {
                    const nodeRect = selectedNode.getBoundingClientRect();
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const currentOffset = nodeRect.top - containerRect.top;
                    // Adjust scroll to place node at top (with small padding)
                    scrollContainer.scrollTop += currentOffset - 10;
                  }
                }
              }
            }, 100);
          }
        }, 200);
      }
    };

    registerNavigationCallback(navigateToNode);
  }, [xmlData, registerNavigationCallback, selectNode]);

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
        ref={(tree) => {
          treeApiRef.current = tree;
        }}
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
