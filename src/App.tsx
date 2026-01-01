/**
 * Main Application Component
 */

import { useState, useEffect } from 'react';
import { Globe, X, Eye, Edit3, AlertTriangle, Undo2, Redo2, ListTree } from 'lucide-react';
import { useXML } from './context/XMLContext';
import { FileUploader } from './components/FileUploader';
import { XMLViewer } from './components/XMLViewer';
import { LocaleSelector } from './components/LocaleSelector';
import { ChangesPanel } from './components/ChangesPanel';

function App() {
  const { xmlData, fileName, editMode, modifications, clearXML, toggleEditMode, undo, redo, canUndo, canRedo } = useXML();
  const modificationCount = modifications.size;
  const [showChangesPanel, setShowChangesPanel] = useState(false);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl key
      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (isMod && e.key === 'z' && !e.shiftKey && editMode && canUndo) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (isMod && ((e.key === 'z' && e.shiftKey) || e.key === 'y') && editMode && canRedo) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, canUndo, canRedo, undo, redo]);

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
                {/* Undo/Redo Buttons (only show in edit mode) */}
                {editMode && (
                  <div className="flex items-center gap-1 border-r border-gray-200 pr-4">
                    <button
                      onClick={undo}
                      disabled={!canUndo}
                      aria-label="Undo last change"
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                        canUndo
                          ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Undo2 className="w-4 h-4" />
                      Undo
                    </button>
                    <button
                      onClick={redo}
                      disabled={!canRedo}
                      aria-label="Redo last undone change"
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                        canRedo
                          ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <Redo2 className="w-4 h-4" />
                      Redo
                    </button>
                  </div>
                )}

                {/* Changes Panel Toggle (only show in edit mode with modifications) */}
                {editMode && modificationCount > 0 && (
                  <button
                    onClick={() => setShowChangesPanel(!showChangesPanel)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      showChangesPanel
                        ? 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
                    }`}
                  >
                    <ListTree className="w-4 h-4" />
                    Changes
                  </button>
                )}

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
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-amber-900">
                  Edit Mode Active
                </p>
                {modificationCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-xs font-bold rounded-full">
                    {modificationCount} {modificationCount === 1 ? 'change' : 'changes'}
                  </span>
                )}
              </div>
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
        <div className="flex-1 flex overflow-hidden">
          {/* Main Viewer */}
          <div className={`flex-1 ${showChangesPanel ? 'border-r border-gray-200' : ''}`}>
            <XMLViewer />
          </div>

          {/* Changes Panel (Sidebar) */}
          {showChangesPanel && (
            <div className="w-96 border-l border-gray-200">
              <ChangesPanel />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
