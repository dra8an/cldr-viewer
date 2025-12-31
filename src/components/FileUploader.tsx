/**
 * FileUploader - File upload with drag-and-drop support
 */

import { useRef } from 'react';
import { Upload, FileCode, AlertCircle } from 'lucide-react';
import { useXMLFile } from '../hooks/useXMLFile';
import { useXML } from '../context/XMLContext';
import clsx from 'clsx';

export function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDragging, handleDragEnter, handleDragOver, handleDragLeave, handleDrop, handleFileInput } = useXMLFile();
  const { error, isLoading } = useXML();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4">
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload XML file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={clsx(
          'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
          'hover:border-blue-500 hover:bg-blue-50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isDragging && 'border-blue-500 bg-blue-50',
          !isDragging && 'border-gray-300 bg-white'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center">
          {isDragging ? (
            <FileCode className="w-16 h-16 text-blue-500 mb-4" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
          )}

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragging ? 'Drop XML file here' : 'Upload XML File'}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Drag and drop an XML file here, or click to browse
          </p>

          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Choose File'}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Maximum file size: 10MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Upload Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
