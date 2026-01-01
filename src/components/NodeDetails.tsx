/**
 * NodeDetails - Display detailed information about a selected XML node
 */

import { Hash, FileText, MessageSquare, Code, List, Type } from 'lucide-react';
import type { XMLNode } from '../types/xml.types';
import {
  getNodeTypeLabel,
  formatTextContent,
  formatAttributesForTable,
  formatPath,
} from '../utils/xmlFormatter';
import { useXML } from '../context/XMLContext';
import { InlineTextEditor } from './InlineTextEditor';

interface NodeDetailsProps {
  node: XMLNode;
}

export function NodeDetails({ node }: NodeDetailsProps) {
  const { editMode, updateNodeText, isNodeModified } = useXML();
  const attributes = formatAttributesForTable(node.attributes);

  // Get icon for node type
  const getTypeIcon = () => {
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
  };

  const TypeIcon = getTypeIcon();
  const isLeaf = !node.children || node.children.length === 0;
  const isModified = isNodeModified(node.id);

  const handleSave = (newValue: string) => {
    updateNodeText(node.id, newValue);
  };

  return (
    <div className="space-y-6">
      {/* Node Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <TypeIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-semibold break-words ${isLeaf ? 'text-blue-700 text-2xl' : 'text-gray-900'}`}>
              {node.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Path */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Hash className="w-4 h-4" />
          <span>Path</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <code className="text-sm text-gray-900 break-all" title={node.path}>
            {formatPath(node.path, 100)}
          </code>
        </div>
      </div>

      {/* Value */}
      {node.textContent !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-base">Value</span>
            {isModified && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                Modified
              </span>
            )}
          </div>
          <InlineTextEditor
            value={node.textContent}
            onSave={handleSave}
            isModified={isModified}
            editMode={editMode}
            placeholder="Enter value..."
          />
        </div>
      )}
    </div>
  );
}
