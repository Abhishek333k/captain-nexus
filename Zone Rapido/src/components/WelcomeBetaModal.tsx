import React, { useEffect } from 'react';

interface WelcomeBetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const WelcomeBetaModal: React.FC<WelcomeBetaModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-8 text-left transition-all transform scale-100 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-amber-400/5'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Welcome Screen"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>Welcome • Public Beta Directory</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          Rapido Coverage & City Office Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
          Find out where Rapido operates, check available ride types in each region, and view verified city office addresses across India.
        </p>

        {/* Feature Highlights */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-lg shrink-0">🗺️</span>
            <div>
              <h3 className="text-xs font-bold text-white">Find Nearest Operating Cities</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Search any location or pincode to check actual driving distances to the closest active cities.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-lg shrink-0">🛵</span>
            <div>
              <h3 className="text-xs font-bold text-white">Check Ride Availability</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Quickly see if Bike Taxi, Auto, Cab, or Delivery are operating in each city.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-lg shrink-0">🏢</span>
            <div>
              <h3 className="text-xs font-bold text-white">Locate City Offices & Support Hubs</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Get full street addresses, landmark cues, and operational timings for local support centers.
              </p>
            </div>
          </div>
        </div>

        {/* Beta Notice Box */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-6 leading-relaxed">
          <div className="font-bold mb-1 flex items-center space-x-1.5 text-amber-400">
            <span>ℹ️</span>
            <span>Beta Notice</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-normal">
            This directory is actively expanding. Coverage boundaries and new city hubs are continuously verified and updated. If your town is not yet listed, check back soon!
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-amber-400/20 active:scale-[0.99]"
        >
          Explore Directory &rarr;
        </button>
      </div>
    </div>
  );
};

