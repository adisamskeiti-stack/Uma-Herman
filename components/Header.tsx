
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header = () => {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/75 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-7 w-7 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Blueprint Explainer
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
