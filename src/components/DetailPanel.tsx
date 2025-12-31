/**
 * DetailPanel - Right panel showing details of the selected node
 */

import { Info } from 'lucide-react';
import { useXML } from '../context/XMLContext';
import { NodeDetails } from './NodeDetails';

export function DetailPanel() {
  const { selectedNode } = useXML();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">
            {selectedNode ? 'Node Details' : 'Details'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {selectedNode ? (
          <div className="p-6">
            <NodeDetails node={selectedNode} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full px-6">
            <div className="text-center max-w-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Node Selected
              </h3>
              <p className="text-sm text-gray-600">
                Select a node from the tree view to see its details, attributes, and content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
