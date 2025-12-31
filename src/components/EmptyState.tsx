/**
 * EmptyState - Display when no XML file is loaded
 */

import { File } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-6 py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-blue-100">
          <File className="w-12 h-12 text-blue-600" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          No XML File Loaded
        </h2>

        <p className="text-gray-600 mb-2 max-w-md mx-auto">
          Upload an XML file to view its structure and explore the tree hierarchy.
        </p>

        <p className="text-sm text-gray-500">
          Drag and drop an XML file or click the upload button to get started.
        </p>
      </div>
    </div>
  );
}
