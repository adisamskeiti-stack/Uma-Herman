
import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import SparklesIcon from './icons/SparklesIcon';
import InfoIcon from './icons/InfoIcon';

interface ExplanationDisplayProps {
  explanation: string;
  isLoading: boolean;
  error: string | null;
  selectedSectionTitle: string | null;
}

const InitialState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <InfoIcon className="h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">Welcome to the Blueprint Explainer</h3>
        <p className="text-slate-400 mt-2 max-w-sm">
            Select a section from the blueprint on the left. Gemini will provide a detailed, easy-to-understand explanation for you here.
        </p>
    </div>
);


const ExplanationDisplay = ({ explanation, isLoading, error, selectedSectionTitle }: ExplanationDisplayProps) => {
  return (
    <div className="h-full flex flex-col">
       <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
             <SparklesIcon className="h-6 w-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-slate-100">
                AI Explanation {selectedSectionTitle && `- ${selectedSectionTitle}`}
            </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
        {!isLoading && !error && !selectedSectionTitle && <InitialState />}
        {!isLoading && !error && explanation && (
            <div 
                className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-100 prose-a:text-cyan-400 prose-code:text-amber-300 prose-code:before:content-none prose-code:after:content-none"
                style={{ whiteSpace: 'pre-wrap' }}
            >
                {explanation}
            </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationDisplay;
