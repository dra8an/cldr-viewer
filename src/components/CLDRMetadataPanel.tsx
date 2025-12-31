/**
 * CLDRMetadataPanel - Display CLDR-specific metadata about the loaded locale
 */

import {
  Info,
  Globe,
  FileType,
  Calendar,
  Hash,
  DollarSign,
  Type,
  Languages,
  CheckCircle2,
  List,
  Quote,
  AlignLeft,
  FileCode,
  User,
  Scissors,
  Smile,
  Box
} from 'lucide-react';
import { useXML } from '../context/XMLContext';
import { extractCLDRMetadata } from '../utils/cldr/metadataExtractor';

/**
 * Get icon for CLDR section
 */
function getSectionIcon(sectionName: string) {
  const icons: Record<string, typeof Calendar> = {
    dates: Calendar,
    numbers: Hash,
    currencies: DollarSign,
    localeDisplayNames: Globe,
    characters: Type,
    listPatterns: List,
    delimiters: Quote,
    layout: AlignLeft,
    posix: FileCode,
    personNames: User,
    segmentations: Scissors,
    annotations: Smile,
    units: Box,
    characterLabels: Type,
  };

  return icons[sectionName] || CheckCircle2;
}

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
      <div className="px-6 py-3">
        {/* Header */}
        <div className="text-xs text-gray-500 uppercase font-medium mb-2">
          Locale Information
        </div>

        {/* Compact Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Locale ID */}
          <div className="flex items-center gap-1.5">
            <FileType className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-mono font-semibold text-gray-900">
              {metadata.localeId}
            </span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="text-xs text-gray-700">
              {metadata.language.name}
            </span>
          </div>

          {/* Territory */}
          {metadata.territory && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span className="text-xs text-gray-700">
                {metadata.territory.name}
              </span>
            </div>
          )}

          {/* Script */}
          {metadata.script && (
            <div className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span className="text-xs text-gray-700">
                {metadata.script.name}
              </span>
            </div>
          )}

          {/* Version */}
          {metadata.version && (
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="text-xs text-gray-700">
                v{metadata.version}
              </span>
            </div>
          )}
        </div>

        {/* Sections Available */}
        {metadata.sections.length > 0 && (
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-1.5">
              {metadata.sections.map((section) => {
                const SectionIcon = getSectionIcon(section.name);
                return (
                  <button
                    key={section.name}
                    onClick={() => handleSectionClick(section.name)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 hover:bg-blue-100 transition-colors group text-xs"
                    title={section.displayName}
                  >
                    <SectionIcon className="w-3 h-3 text-gray-600 flex-shrink-0 group-hover:text-blue-700" />
                    <span className="text-gray-700 group-hover:text-blue-700 whitespace-nowrap">
                      {section.displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
