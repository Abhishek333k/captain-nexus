import React, { useState } from 'react';
import { City, ServiceType } from '../../../Zone Rapido/src/data/cities';

interface CityEditModalProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCity: City) => void;
}

const ALL_SERVICES: { id: ServiceType; label: string }[] = [
  { id: 'bike', label: 'Bike Taxi' },
  { id: 'auto', label: 'Auto' },
  { id: 'cab', label: 'Cab' },
  { id: 'e_rickshaw', label: 'E-Rickshaw' },
  { id: 'tuk_tuk', label: 'Tuk-Tuk' },
  { id: 'b2b', label: 'B2B Delivery' }
];

export const CityEditModal: React.FC<CityEditModalProps> = ({
  city,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !city) return null;

  const [name, setName] = useState(city.name);
  const [state, setState] = useState(city.state);
  const [lat, setLat] = useState(city.lat.toString());
  const [lng, setLng] = useState(city.lng.toString());
  const [services, setServices] = useState<ServiceType[]>(city.services || []);
  const [notes, setNotes] = useState(city.notes || '');
  const [active, setActive] = useState(city.active);

  const toggleService = (svc: ServiceType) => {
    setServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...city,
      name,
      state,
      lat: parseFloat(lat) || city.lat,
      lng: parseFloat(lng) || city.lng,
      services,
      notes: notes || undefined,
      active
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
              Edit Operating City
            </span>
            <h2 className="text-base font-bold text-white mt-1">{city.name} ({city.id})</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State / Province</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supported Services</label>
            <div className="grid grid-cols-3 gap-2">
              {ALL_SERVICES.map((s) => {
                const isSelected = services.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Notes</label>
            <input
              type="text"
              placeholder="e.g. Expanded municipal boundary zone"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200">Active Operational Status</span>
              <p className="text-[11px] text-slate-400">Controls whether city appears in public routing directory</p>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                active
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {active ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
