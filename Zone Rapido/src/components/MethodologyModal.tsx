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
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden p-6 text-left transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
              Beta Protocol
            </span>
            <h3 className="text-base font-bold">Data Methodology & Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <div className="font-bold mb-1 flex items-center space-x-1.5">
              <span>🚀</span>
              <span>Operational Public Beta Status</span>
            </div>
            <p className="text-[11px] text-slate-300">
              The SilenVault Mobility directory is in active operational beta. Coverage boundaries, vehicle tier availability, and physical office coordinates are undergoing continuous municipal verification.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/40">
              <h4 className="font-bold text-amber-400 text-xs mb-1">1. Municipal Boundary Polygons</h4>
              <p className="text-slate-400 text-[11px]">
                Administrative city borders are sourced via OpenStreetMap (OSM) municipal boundary records. Point-in-polygon verification uses ray-casting calculations to determine whether coordinates fall inside official municipal limits.
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/40">
              <h4 className="font-bold text-blue-400 text-xs mb-1">2. Statutory Office Locations</h4>
              <p className="text-slate-400 text-[11px]">
                Corporate headquarters and registered office addresses are verified against public filings of Roppen Transportation Services Private Limited with the Ministry of Corporate Affairs (MCA). Landmark notes and regional offices are continually verified.
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/40">
              <h4 className="font-bold text-emerald-400 text-xs mb-1">3. Driving Commute Calculation Engine</h4>
              <p className="text-slate-400 text-[11px]">
                Distance metrics prioritize real-world road transportation routing using OSRM driving profiles, superseding straight-line aerial estimates to provide practical commuter feasibility metrics.
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/40">
              <h4 className="font-bold text-purple-400 text-xs mb-1">4. Continuous Realtime Synchronization</h4>
              <p className="text-slate-400 text-[11px]">
                Fleet administrators publish newly registered cities and boundary updates through the operations control plane, broadcasting changes live across the directory via Cloud Firestore.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-400/20"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

