import React, { useState } from 'react';

interface BetaBannerProps {
  isDarkMode: boolean;
  onOpenMethodology?: () => void;
}

const STORAGE_KEY = 'silenvault_rapido_beta_banner_dismissed_v1';

export const BetaBanner: React.FC<BetaBannerProps> = ({ isDarkMode, onOpenMethodology }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
  };

  if (isDismissed) return null;

  return (
    <div
      className={`w-full border-b px-3 sm:px-4 py-2 transition-colors duration-200 select-none text-xs ${
        isDarkMode
          ? 'bg-amber-500/10 border-amber-500/20 text-slate-200'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Beta badge & Message */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <span className="shrink-0 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
            Operational Beta v0.9
          </span>
          <p className="truncate text-[11px] sm:text-xs text-slate-300 font-medium">
            <span className="hidden sm:inline">Coverage directory under continuous verification. </span>
            <span>Municipal boundaries, fleet tiers, and office locations are actively updating in real-time.</span>
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {onOpenMethodology && (
            <button
              onClick={onOpenMethodology}
              className={`text-[11px] font-bold underline underline-offset-2 transition-colors ${
                isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              Sources & Methodology
            </button>
          )}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss Beta Notice"
            className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

