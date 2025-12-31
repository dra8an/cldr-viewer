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

interface NodeDetailsProps {
  node: XMLNode;
}

export function NodeDetails({ node }: NodeDetailsProps) {
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
            <p className="text-sm text-gray-500 mt-1">
              {isLeaf ? 'Leaf Element' : getNodeTypeLabel(node.type)}
            </p>
          </div>
        </div>
      </div>

      {/* Node Type */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Type className="w-4 h-4" />
          <span>Type</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <code className="text-sm text-gray-900">{node.type}</code>
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

      {/* Attributes */}
      {attributes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <List className="w-4 h-4" />
            <span>Attributes ({attributes.length})</span>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attributes.map(({ key, value }) => (
                  <tr key={key} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {key}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 break-all">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Value */}
      {node.textContent && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-base">Value</span>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-4">
            <pre className="text-base text-blue-900 font-semibold whitespace-pre-wrap break-words font-mono">
              {formatTextContent(node.textContent)}
            </pre>
          </div>
        </div>
      )}

      {/* Node ID (for debugging) */}
      <div className="pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Node ID:</span> {node.id}
        </div>
      </div>
    </div>
  );
}
