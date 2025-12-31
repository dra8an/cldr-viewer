/**
 * Main Application Component
 */

import { Globe, X } from 'lucide-react';
import { useXML } from './context/XMLContext';
import { FileUploader } from './components/FileUploader';
import { XMLViewer } from './components/XMLViewer';
import { LocaleSelector } from './components/LocaleSelector';

function App() {
  const { xmlData, fileName, clearXML } = useXML();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                CLDR Viewer
              </h1>
              {fileName && (
                <p className="text-sm text-gray-600">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LocaleSelector />

            {xmlData && (
              <button
                onClick={clearXML}
                aria-label="Clear XML file and return to upload screen"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!xmlData ? (
        <div className="container mx-auto max-w-4xl py-12">
          <FileUploader />
        </div>
      ) : (
        <XMLViewer />
      )}
    </div>
  );
}

export default App;
