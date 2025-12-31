/**
 * CLDRMetadataPanel - Display CLDR-specific metadata about the loaded locale
 */

import { Info, Globe, FileType, Calendar, Hash, DollarSign, Type, Languages, CheckCircle2 } from 'lucide-react';
import { useXML } from '../context/XMLContext';
import { extractCLDRMetadata } from '../utils/cldr/metadataExtractor';

export function CLDRMetadataPanel() {
  const { xmlData, fileName, navigateToNode } = useXML();

  if (!xmlData) {
    return null;
  }

  const metadata = extractCLDRMetadata(xmlData, fileName);

  const handleSectionClick = (sectionName: string) => {
    navigateToNode(sectionName);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">Locale Information</h2>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Locale ID */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FileType className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 uppercase font-medium">Locale ID</div>
              <div className="text-sm font-mono font-semibold text-gray-900 mt-0.5">
                {metadata.localeId}
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Languages className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 uppercase font-medium">Language</div>
              <div className="text-sm text-gray-900 mt-0.5">
                {metadata.language.name} ({metadata.language.code})
              </div>
            </div>
          </div>

          {/* Territory */}
          {metadata.territory && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500 uppercase font-medium">Territory</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {metadata.territory.name} ({metadata.territory.code})
                </div>
              </div>
            </div>
          )}

          {/* Script */}
          {metadata.script && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Type className="w-4 h-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500 uppercase font-medium">Script</div>
                <div className="text-sm text-gray-900 mt-0.5">
                  {metadata.script.name} ({metadata.script.code})
                </div>
              </div>
            </div>
          )}

          {/* Version */}
          {metadata.version && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-teal-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500 uppercase font-medium">CLDR Version</div>
                <div className="text-sm text-gray-900 mt-0.5">{metadata.version}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sections Available */}
        {metadata.sections.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-medium mb-2">
              Available Sections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {metadata.sections.map((section) => (
                <button
                  key={section.name}
                  onClick={() => handleSectionClick(section.name)}
                  className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-blue-50 transition-colors group"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 group-hover:text-green-700" />
                  <span className="text-xs text-gray-700 group-hover:text-blue-700 group-hover:font-medium">
                    {section.displayName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
