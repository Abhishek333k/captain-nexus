import React, { useEffect } from 'react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-7 text-left transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              Beta Directory
            </span>
            <h3 className="text-base font-bold">About Coverage & Office Data</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1 text-xs leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <div className="font-bold mb-1 flex items-center space-x-1.5 text-amber-400">
              <span>🚀</span>
              <span>Ongoing Beta Expansion</span>
            </div>
            <p className="text-[11px] text-slate-300">
              This public directory is actively expanding. New cities, expanded boundaries, and updated city office locations are added regularly. If your area is not yet listed, check back soon!
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="border border-slate-800 rounded-2xl p-3.5 bg-slate-950/40">
              <h4 className="font-bold text-amber-400 text-xs mb-1">🚗 Real Road Travel Distance</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Calculates actual road driving distance from your searched location, giving you an accurate commute estimate to the nearest operating city rather than a straight flight line.
              </p>
            </div>

            <div className="border border-slate-800 rounded-2xl p-3.5 bg-slate-950/40">
              <h4 className="font-bold text-blue-400 text-xs mb-1">🏢 Verified City Offices & Support</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Physical street addresses, nearby landmarks, and operational hours are checked and verified so you know exactly where to go for local captain onboarding or customer assistance.
              </p>
            </div>

            <div className="border border-slate-800 rounded-2xl p-3.5 bg-slate-950/40">
              <h4 className="font-bold text-emerald-400 text-xs mb-1">🛵 Live Ride Availability</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Each city listing highlights active transport options—including Bike Taxi, Auto, Cab, E-Rickshaw, and Delivery—so you can quickly check which services are running in your region.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-400/20 active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
