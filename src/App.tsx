/**
 * Main Application Component
 */

import { Globe, X, Eye, Edit3, AlertTriangle } from 'lucide-react';
import { useXML } from './context/XMLContext';
import { FileUploader } from './components/FileUploader';
import { XMLViewer } from './components/XMLViewer';
import { LocaleSelector } from './components/LocaleSelector';

function App() {
  const { xmlData, fileName, editMode, clearXML, toggleEditMode } = useXML();

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
              <>
                {/* Edit Mode Toggle */}
                <button
                  onClick={toggleEditMode}
                  aria-label={editMode ? 'Switch to view mode' : 'Switch to edit mode'}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    editMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
                  }`}
                >
                  {editMode ? (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Mode
                    </>
                  )}
                </button>

                {/* Clear Button */}
                <button
                  onClick={clearXML}
                  aria-label="Clear XML file and return to upload screen"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Edit Mode Banner */}
      {xmlData && editMode && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="px-6 py-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Edit Mode Active
              </p>
              <p className="text-xs text-amber-700">
                Changes are not automatically saved. You'll need to export the modified XML when ready.
              </p>
            </div>
          </div>
        </div>
      )}

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
