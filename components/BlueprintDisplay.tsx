
import React from 'react';
import { BlueprintSection } from '../types';

interface BlueprintDisplayProps {
  sections: BlueprintSection[];
  onSectionSelect: (index: number) => void;
  selectedIndex: number | null;
  isLoading: boolean;
  isBlueprintLoading: boolean;
  blueprintError: string | null;
}

const BlueprintDisplay = ({ sections, onSectionSelect, selectedIndex, isLoading, isBlueprintLoading, blueprintError }: BlueprintDisplayProps) => {
  const selectedContent = selectedIndex !== null ? sections[selectedIndex]?.content : '';

  if (isBlueprintLoading) {
    return (
      <div className="p-6">
        <div className="h-6 bg-slate-700 rounded w-3/4 animate-pulse mb-6"></div>
        <div className="space-y-2">
            <div className="h-10 bg-slate-800/60 rounded animate-pulse"></div>
            <div className="h-10 bg-slate-800/60 rounded animate-pulse"></div>
            <div className="h-10 bg-slate-800/60 rounded animate-pulse"></div>
            <div className="h-10 bg-slate-800/60 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    );
  }

  if (blueprintError) {
    return (
        <div className="m-4 p-4 text-red-300 bg-red-900/50 rounded-lg">
            <h3 className="font-bold mb-2">Error Loading Blueprint</h3>
            <p className="text-sm">{blueprintError}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-100">Blueprint Sections</h2>
        <p className="text-sm text-slate-400 mt-1">Select a section to learn more.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionSelect(index)}
            disabled={isLoading}
            className={`w-full text-left px-4 py-2.5 rounded-md transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedIndex === index
                ? 'bg-cyan-500/10 text-cyan-300'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>
      <div className="flex-1 border-t border-slate-700/50 overflow-y-auto">
        <div className="p-6">
            <h3 className="text-md font-semibold text-slate-100 mb-3">Section Content</h3>
            <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono bg-slate-800/50 p-4 rounded-lg">
                <code>{selectedContent || "Select a section to view its content here."}</code>
            </pre>
        </div>
      </div>
    </div>
  );
};

export default BlueprintDisplay;
