
import React, { useState, useEffect, useCallback } from 'react';
import { BlueprintSection } from './types';
import BlueprintDisplay from './components/BlueprintDisplay';
import ExplanationDisplay from './components/ExplanationDisplay';
import { explainSectionStream } from './services/geminiService';
import Header from './components/Header';

const App = () => {
  const [sections, setSections] = useState<BlueprintSection[]>([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlueprintLoading, setIsBlueprintLoading] = useState<boolean>(true);
  const [blueprintError, setBlueprintError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlueprint = async () => {
      try {
        setIsBlueprintLoading(true);
        const response = await fetch('/blueprint.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch blueprint: ${response.statusText}`);
        }
        const text = await response.text();

        const rawSections = text.split('\n---');
        const parsedSections = rawSections.map(s => {
          const content = s.trim();
          const firstLine = content.split('\n')[0] || '';
          const title = firstLine.startsWith('##') ? firstLine.replace('##', '').trim() : 
                        (content.startsWith('# ') ? content.split('\n')[0].replace('# ', '').replace('Blueprint.md', 'Introduction').trim() : 'Overview');
          return { title, content };
        }).filter(s => s.content);
        setSections(parsedSections);
        setBlueprintError(null);
      } catch (err) {
        if (err instanceof Error) {
            setBlueprintError(err.message);
        } else {
            setBlueprintError("An unknown error occurred while loading the blueprint.");
        }
      } finally {
        setIsBlueprintLoading(false);
      }
    };
    
    fetchBlueprint();
  }, []);

  const handleSectionSelect = useCallback(async (index: number) => {
    if (isLoading) return;

    setSelectedSectionIndex(index);
    setExplanation('');
    setError(null);

    const cacheKey = `blueprint-explanation-${index}`;
    const cachedExplanation = sessionStorage.getItem(cacheKey);

    if (cachedExplanation) {
      setExplanation(cachedExplanation);
      return;
    }

    setIsLoading(true);

    const selectedSection = sections[index];
    if (!selectedSection) {
        setError("Could not find the selected section.");
        setIsLoading(false);
        return;
    }

    try {
      const stream = await explainSectionStream(selectedSection.content);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setExplanation(fullText);
      }
      sessionStorage.setItem(cacheKey, fullText);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [sections, isLoading]);
  
  const selectedSectionTitle = selectedSectionIndex !== null ? sections[selectedSectionIndex]?.title : null;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="h-full overflow-y-auto border-r border-slate-700/50">
            <BlueprintDisplay 
                sections={sections}
                onSectionSelect={handleSectionSelect}
                selectedIndex={selectedSectionIndex}
                isLoading={isLoading}
                isBlueprintLoading={isBlueprintLoading}
                blueprintError={blueprintError}
            />
        </div>
        <div className="h-full overflow-y-auto">
            <ExplanationDisplay 
                explanation={explanation}
                isLoading={isLoading}
                error={error}
                selectedSectionTitle={selectedSectionTitle}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
