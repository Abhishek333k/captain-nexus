import React from 'react';
import { City } from '../data/cities';

interface CityDetailDrawerProps {
  city: City | null;
  isDarkMode: boolean;
  onClose: () => void;
  onReportUpdate: (target: { id?: string; name?: string }) => void;
}

export const CityDetailDrawer: React.FC<CityDetailDrawerProps> = ({
  city,
  isDarkMode,
  onClose,
  onReportUpdate
}) => {
  if (!city) return null;

  const copyText = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const openGoogleMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed md:absolute z-30 bottom-0 md:bottom-4 right-0 md:right-4 top-auto md:top-4 w-full md:w-88 lg:w-96 max-h-[75vh] md:max-h-full rounded-t-2xl md:rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 select-none ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 backdrop-blur-md'
          : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3.5 border-b flex items-start justify-between gap-2 shrink-0 ${
        isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
      }`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                city.active
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {city.active ? 'Serviceable City' : 'Inactive Zone'}
            </span>
            <span className="text-[11px] font-medium text-slate-400 truncate">
              {city.state}
            </span>
          </div>
          <h3 className="text-base font-black tracking-tight truncate select-text cursor-text">
            {city.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Close details"
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          ✕
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* Active Services */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Available Services
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(city.services ?? []).map((svc) => (
              <span
                key={svc}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                  isDarkMode
                    ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {svc.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Regional Cluster / Corridor */}
        {city.clusterName && (
          <div className={`p-3 rounded-xl border ${
            isDarkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className={`font-bold text-[11px] flex items-center gap-1.5 ${
              isDarkMode ? 'text-purple-300' : 'text-purple-900'
            }`}>
              <span>🌐</span>
              <span>{city.clusterName}</span>
            </div>
            {city.isSubDistrict && (
              <p className={`text-[10px] mt-1 ${
                isDarkMode ? 'text-purple-200/80' : 'text-purple-700'
              }`}>
                ⚡ Sub-district municipality with cross-dispatch eligibility to parent hub.
              </p>
            )}
          </div>
        )}

        {/* Primary City Office */}
        {city.address ? (
          <div className={`p-3 rounded-xl border space-y-1.5 ${
            isDarkMode ? 'bg-slate-950/80 border-amber-500/30' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-[11px] flex items-center gap-1.5 ${
                isDarkMode ? 'text-amber-400' : 'text-amber-900'
              }`}>
                <span>🏢</span>
                <span>{city.additionalOffices?.length ? 'Primary City Office' : 'Verified City Office'}</span>
              </span>
              <button
                type="button"
                onClick={() => copyText(`${city.address}${city.pincode ? ` PIN: ${city.pincode}` : ''}`)}
                className={`text-[10px] px-2 py-0.5 rounded border font-semibold cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                📋 Copy
              </button>
            </div>
            <p className="leading-relaxed select-text cursor-text">
              {city.address}
            </p>
            {city.pincode && (
              <div className="text-[11px] font-mono text-slate-400 select-text">
                PIN: {city.pincode}
              </div>
            )}
            {city.landmarkNote && (
              <div className={`text-[11px] italic ${isDarkMode ? 'text-amber-300/90' : 'text-amber-800'}`}>
                📍 {city.landmarkNote}
              </div>
            )}
          </div>
        ) : (
          <div className={`p-3 rounded-xl border text-[11px] ${
            isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            No physical branch office yet — digital transit service is active.
          </div>
        )}

        {/* Additional Regional Offices */}
        {city.additionalOffices && city.additionalOffices.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Additional Regional Hubs ({city.additionalOffices.length})
            </div>
            {city.additionalOffices.map((office, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border space-y-1 ${
                  isDarkMode ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50/70 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-bold text-[11px] ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                    📍 {office.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`${office.address}${office.pincode ? ` PIN: ${office.pincode}` : ''}`)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-white text-blue-900 border-blue-300'
                    }`}
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-[11px] leading-snug select-text cursor-text">{office.address}</p>
                {office.pincode && (
                  <div className="text-[10px] font-mono text-slate-400 select-text">PIN: {office.pincode}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {city.notes && (
          <div className="text-[11px] italic text-slate-400 select-text">
            Note: {city.notes}
          </div>
        )}

        {/* Coordinates & Actions */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <span className="text-[10px] font-mono text-slate-400 select-text">
            {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openGoogleMaps(city.lat, city.lng, city.name)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
            >
              Directions ↗
            </button>
            <button
              type="button"
              onClick={() => onReportUpdate({ id: city.id, name: city.name })}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 hover:border-amber-400 text-slate-300'
                  : 'border-slate-300 hover:border-amber-500 text-slate-700'
              }`}
            >
              Update Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
