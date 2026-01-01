/**
 * ChangesPanel - Displays list of all modifications with diff view and revert options
 */

import { useState } from 'react';
import {
  Edit3,
  RotateCcw,
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  Trash2
} from 'lucide-react';
import { useXML } from '../context/XMLContext';
import type { NodeModification } from '../types/xml.types';

export function ChangesPanel() {
  const { modifications, revertModification, discardAllModifications, selectNode, xmlData } = useXML();
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());

  const changes = Array.from(modifications.values()).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const toggleExpanded = (nodeId: string) => {
    setExpandedChanges(prev => {
      const updated = new Set(prev);
      if (updated.has(nodeId)) {
        updated.delete(nodeId);
      } else {
        updated.add(nodeId);
      }
      return updated;
    });
  };

  const handleNavigate = (change: NodeModification) => {
    if (!xmlData) return;

    // Find the node and select it
    const findNode = (node: any): any => {
      if (node.id === change.nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };

    const targetNode = findNode(xmlData);
    if (targetNode) {
      selectNode(targetNode);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (changes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500 p-6">
          <Edit3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium">No changes yet</p>
          <p className="text-xs mt-1">Modifications will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">
              Changes ({changes.length})
            </h3>
          </div>
          {changes.length > 0 && (
            <button
              onClick={discardAllModifications}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Discard all changes"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Revert All
            </button>
          )}
        </div>
      </div>

      {/* Changes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {changes.map((change) => {
            const isExpanded = expandedChanges.has(change.nodeId);

            return (
              <div key={change.nodeId} className="group">
                {/* Change Header */}
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpanded(change.nodeId)}
                      className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Change Info */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleNavigate(change)}
                        className="w-full text-left group-hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate font-mono">
                              {change.nodeName || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {change.path || '—'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(change.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Preview of change (when collapsed) */}
                        {!isExpanded && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="text-gray-600 font-mono truncate max-w-[40%]">
                              "{change.originalValue}"
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-amber-700 font-mono font-semibold truncate max-w-[40%]">
                              "{change.newValue}"
                            </span>
                          </div>
                        )}
                      </button>

                      {/* Expanded Diff View */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2">
                          {/* Original Value */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              Original:
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                              <pre className="text-xs text-red-900 font-mono whitespace-pre-wrap break-words">
                                {change.originalValue || <span className="text-red-400 italic">Empty</span>}
                              </pre>
                            </div>
                          </div>

                          {/* Modified Value */}
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              Modified:
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                              <pre className="text-xs text-green-900 font-mono whitespace-pre-wrap break-words">
                                {change.newValue || <span className="text-green-400 italic">Empty</span>}
                              </pre>
                            </div>
                          </div>

                          {/* Revert Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              revertModification(change.nodeId);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Revert This Change
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
