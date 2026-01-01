/**
 * InlineTextEditor - Editable text field with save/cancel actions
 */

import { useState, useEffect, useRef } from 'react';
import { Save, X, Edit3 } from 'lucide-react';

interface InlineTextEditorProps {
  /** Current value */
  value: string;

  /** Callback when value is saved */
  onSave: (newValue: string) => void;

  /** Whether the value has been modified */
  isModified?: boolean;

  /** Placeholder text */
  placeholder?: string;

  /** Whether editing is enabled */
  editMode: boolean;

  /** Optional validation function */
  validate?: (value: string) => { valid: boolean; message?: string };
}

export function InlineTextEditor({
  value,
  onSave,
  isModified = false,
  placeholder = '',
  editMode,
  validate
}: InlineTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Update editValue when value prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    // Validate if validator provided
    if (validate) {
      const result = validate(editValue);
      if (!result.valid) {
        setValidationError(result.message || 'Invalid value');
        return;
      }
    }

    onSave(editValue);
    setIsEditing(false);
    setValidationError(null);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If not in edit mode, show read-only view
  if (!editMode) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-4">
        <pre className="text-base text-blue-900 font-semibold whitespace-pre-wrap break-words font-mono">
          {value || <span className="text-gray-400 italic">No value</span>}
        </pre>
      </div>
    );
  }

  // Edit mode - if editing, show textarea and buttons
  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full px-4 py-3 text-base font-mono rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px] ${
              validationError
                ? 'border-red-300 bg-red-50'
                : 'border-blue-300 bg-white'
            }`}
          />
        </div>

        {validationError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-4 h-4" />
            {validationError}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <span className="text-xs text-gray-500 ml-2">
            Enter to save, Esc to cancel
          </span>
        </div>
      </div>
    );
  }

  // Edit mode - not editing, show clickable value
  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`w-full text-left rounded-lg px-4 py-4 border-2 transition-colors group ${
        isModified
          ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
          : 'bg-blue-50 border-blue-200 hover:border-blue-400'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <pre className={`text-base font-semibold whitespace-pre-wrap break-words font-mono flex-1 ${
          isModified ? 'text-amber-900' : 'text-blue-900'
        }`}>
          {value || <span className="text-gray-400 italic">No value</span>}
        </pre>
        <Edit3 className={`w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          isModified ? 'text-amber-600' : 'text-blue-600'
        }`} />
      </div>
      {isModified && (
        <p className="text-xs text-amber-700 mt-2 font-medium">
          Modified - Click to edit
        </p>
      )}
    </button>
  );
}
