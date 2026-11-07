import React, { useState } from 'react';
import { City, ServiceType } from '../data/cities';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  onAddCity: (newCity: City) => Promise<void>;
  onEditCity: (updatedCity: City) => Promise<void>;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
}

const ALL_SERVICES: ServiceType[] = ['bike', 'auto', 'cab', 'b2b', 'e_rickshaw', 'tuk_tuk'];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  cities,
  onAddCity,
  onEditCity,
  onToggleActive
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Edit / Add Form State
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['bike', 'auto']);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    if (validPasscode && passcode.trim() === validPasscode) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect Admin Passcode. Access denied.');
    }
  };

  const startEditCity = (city: City) => {
    setEditingCityId(city.id);
    setName(city.name);
    setState(city.state);
    setLat(city.lat.toString());
    setLng(city.lng.toString());
    setSelectedServices(city.services);
    setFeedback(`Editing "${city.name}"`);
  };

  const cancelEdit = () => {
    setEditingCityId(null);
    setName('');
    setState('');
    setLat('');
    setLng('');
    setSelectedServices(['bike', 'auto']);
    setFeedback(null);
  };

  const handleServiceToggle = (svc: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !state.trim() || !lat || !lng) {
      setFeedback('Please fill out all city fields.');
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      setFeedback('Invalid latitude or longitude coordinate values.');
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingCityId) {
        // Edit existing city
        const updatedCity: City = {
          id: editingCityId,
          name: name.trim(),
          state: state.trim(),
          lat: latitude,
          lng: longitude,
          services: selectedServices,
          active: true
        };
        await onEditCity(updatedCity);
        setFeedback(`City "${name}" updated successfully.`);
        cancelEdit();
      } else {
        // Add new city
        const newCity: City = {
          id: name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now(),
          name: name.trim(),
          state: state.trim(),
          lat: latitude,
          lng: longitude,
          services: selectedServices,
          active: true
        };
        await onAddCity(newCity);
        cancelEdit();
        setFeedback(`City "${newCity.name}" added successfully.`);
      }
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to save city.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <h2 className="text-lg font-bold text-amber-400">
              {isAuthenticated ? 'Admin Console: Manage Operational Hubs' : 'Admin Security Verification'}
            </h2>
            <p className="text-xs text-slate-400">
              {isAuthenticated
                ? 'Add, edit coordinates, toggle services, or disable city clusters'
                : 'Enter your authorization passcode to edit production databases'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isAuthenticated ? (
            /* Login Gate */
            <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-4 py-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xl mb-2">
                  🔒
                </div>
                <h3 className="font-bold text-sm text-white">Administrator Access Verification</h3>
                <p className="text-xs text-slate-400">Enter your assigned executive key to manage operational data</p>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter Admin Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  autoFocus
                />
                {authError && <p className="text-[11px] text-rose-400 mt-1.5">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Authenticate & Unlock Console
              </button>
            </form>
          ) : (
            /* Authenticated Admin Workspace */
            <>
              {feedback && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-xl flex items-center justify-between">
                  <span>{feedback}</span>
                  {editingCityId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              )}

              {/* Add / Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {editingCityId ? 'Edit Existing City Hub' : 'Add New Active City Hub'}
                  </h3>
                  {editingCityId && (
                    <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded">
                      EDIT MODE
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">City Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tumakuru"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      placeholder="e.g. 13.3409"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      placeholder="e.g. 77.1009"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Supported Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SERVICES.map((svc) => (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => handleServiceToggle(svc)}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                          selectedServices.includes(svc)
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {svc.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    {submitting ? 'Saving...' : editingCityId ? 'Save Changes' : 'Add Active City Hub'}
                  </button>
                  {editingCityId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Live Directory with Edit & Disable Controls */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-3">
                  Live Hubs Directory ({cities.length})
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-200">{city.name}</span>
                          <span className="text-slate-500">({city.state})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {city.lat.toFixed(4)}, {city.lng.toFixed(4)} • {city.services.join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => startEditCity(city)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold border border-slate-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleActive(city.id, city.active)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            city.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                        >
                          {city.active ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
