/**
 * TreePanel - Left panel with file name header and tree view
 */

import { useEffect, useRef, useState } from 'react';
import { FileCode, Loader2, AlertCircle } from 'lucide-react';
import { useXML } from '../context/XMLContext';
import { TreeView } from './TreeView';
import { countNodes } from '../utils/xmlFormatter';

export function TreePanel() {
  const { xmlData, fileName, isLoading, error } = useXML();
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(600);

  // Calculate available height for tree
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 20;
        setHeight(Math.max(400, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {fileName || 'XML Structure'}
            </h2>
            {xmlData && (
              <p className="text-xs text-gray-500">
                {countNodes(xmlData)} nodes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading XML...</span>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex items-center justify-center h-full px-4">
            <div className="flex items-start gap-2 text-red-600 max-w-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Error Loading File</p>
                <p className="text-xs text-red-500 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && xmlData && (
          <TreeView height={height} />
        )}

        {!isLoading && !error && !xmlData && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No XML data loaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
