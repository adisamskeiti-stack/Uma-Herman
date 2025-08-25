
import React from 'react';

const LoadingSkeleton = () => (
  <div className="p-4 space-y-5 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
    <div className="space-y-3">
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
    <div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div>
    <div className="space-y-3">
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
  </div>
);

export default LoadingSkeleton;
