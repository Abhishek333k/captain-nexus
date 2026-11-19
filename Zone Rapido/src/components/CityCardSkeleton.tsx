import React from 'react';

export const CityCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-2.5 animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/40"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 w-3/4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-6 bg-slate-800 rounded"></div>
                <div className="h-4 w-28 bg-slate-800 rounded"></div>
                <div className="h-3 w-16 bg-slate-800/60 rounded"></div>
              </div>
              <div className="h-3 w-40 bg-slate-800/50 rounded"></div>
              <div className="h-10 w-full bg-slate-950/70 rounded-lg border border-slate-800/60 p-2 space-y-1">
                <div className="h-2.5 w-20 bg-slate-800 rounded"></div>
                <div className="h-2.5 w-48 bg-slate-800/60 rounded"></div>
              </div>
              <div className="flex space-x-1 pt-1">
                <div className="h-4 w-12 bg-slate-800/60 rounded"></div>
                <div className="h-4 w-10 bg-slate-800/60 rounded"></div>
                <div className="h-4 w-14 bg-slate-800/60 rounded"></div>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-12 bg-slate-800 rounded ml-auto"></div>
              <div className="h-3 w-14 bg-slate-800/50 rounded ml-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

