/**
 * CLDRNodeDetails - Enhanced node details with CLDR-specific context and validation
 */

import {
  Info,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Link2,
  ExternalLink
} from 'lucide-react';
import type { XMLNode } from '../types/xml.types';
import { NodeDetails } from './NodeDetails';
import { extractCLDRContext } from '../utils/cldr/contextExtractor';
import { generateValuePreview } from '../utils/cldr/valuePreview';
import { validateCLDRNode, getValidationColor, getValidationBgColor, getValidationBorderColor } from '../utils/cldr/validation';
import { findRelatedElements } from '../utils/cldr/relatedElements';
import { useXML } from '../context/XMLContext';

interface CLDRNodeDetailsProps {
  node: XMLNode;
}

export function CLDRNodeDetails({ node }: CLDRNodeDetailsProps) {
  const { xmlData, selectNode } = useXML();

  // Extract CLDR-specific information
  const context = extractCLDRContext(node);
  const preview = generateValuePreview(node);
  const validation = validateCLDRNode(node);
  const relatedElements = xmlData ? findRelatedElements(node, xmlData) : [];

  // Get validation icon
  const ValidationIcon = validation.severity === 'valid'
    ? CheckCircle2
    : validation.severity === 'warning'
    ? AlertTriangle
    : XCircle;

  return (
    <div className="space-y-6">
      {/* Base Node Details */}
      <NodeDetails node={node} />

      {/* CLDR Context */}
      {context && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <Info className="w-3.5 h-3.5" />
                <span>{context.category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>What is this?</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-900">{context.description}</p>
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Usage</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-900">{context.usage}</p>
              </div>
            </div>

            {/* LDML Specification Link */}
            {context.ldmlSpec && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <a
                  href={`https://www.unicode.org/reports/tr35/#${context.ldmlSpec}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  LDML Spec §{context.ldmlSpec}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Value Preview */}
      {preview && preview.examples.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Preview Examples</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 space-y-2">
              {preview.examples.map((example, index) => (
                <div key={index} className="text-sm font-mono text-purple-900">
                  {example}
                </div>
              ))}
              {preview.explanation && (
                <p className="text-xs text-purple-700 pt-2 border-t border-purple-200">
                  {preview.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation */}
      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ValidationIcon className={`w-4 h-4 ${getValidationColor(validation.severity)}`} />
            <span>Validation</span>
          </div>
          <div className={`${getValidationBgColor(validation.severity)} border ${getValidationBorderColor(validation.severity)} rounded-lg px-4 py-3`}>
            <div className="flex items-start gap-2">
              <ValidationIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getValidationColor(validation.severity)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">
                  {validation.message}
                </p>
                {validation.suggestion && (
                  <p className="text-sm text-gray-700 mt-1">
                    {validation.suggestion}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Elements */}
      {relatedElements.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Link2 className="w-4 h-4 text-teal-600" />
              <span>Related Elements ({relatedElements.length})</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-teal-200">
                {relatedElements.map((related, index) => (
                  <button
                    key={index}
                    onClick={() => selectNode(related.node)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-teal-900 mb-1">
                          {related.label}
                        </p>
                        <p className="text-sm text-teal-800 font-mono truncate">
                          {related.value}
                        </p>
                      </div>
                      <Link2 className="w-4 h-4 text-teal-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
