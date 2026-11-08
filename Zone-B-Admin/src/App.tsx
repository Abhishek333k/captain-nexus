import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { AdminLogin } from './components/AdminLogin';
import { RAPIDO_OFFICIAL_CITIES, City } from '../../src/data/cities';
import { ROPPEN_STATUTORY_OFFICES, CityOffice } from '../../src/data/offices';

export default function AdminApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'cities' | 'offices' | 'boundaries'>('cities');
  const [cities, setCities] = useState<City[]>(RAPIDO_OFFICIAL_CITIES);
  const [offices, setOffices] = useState<CityOffice[]>(ROPPEN_STATUTORY_OFFICES);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // New city form state
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('');
  const [newCityLat, setNewCityLat] = useState('');
  const [newCityLng, setNewCityLng] = useState('');
  const [newCityNotes, setNewCityNotes] = useState('');

  // Office edit state
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(null);
  const [landmarkNote, setLandmarkNote] = useState('');

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleToggleCity = (id: string) => {
    setCities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName || !newCityLat || !newCityLng) return;
    const newId = newCityName.toLowerCase().replace(/\s+/g, '_');
    const item: City = {
      id: newId,
      name: newCityName,
      state: newCityState || 'India',
      lat: parseFloat(newCityLat),
      lng: parseFloat(newCityLng),
      services: ['bike', 'auto', 'cab', 'b2b'],
      active: true,
      notes: newCityNotes || undefined
    };
    setCities((prev) => [item, ...prev]);
    setNewCityName('');
    setNewCityState('');
    setNewCityLat('');
    setNewCityLng('');
    setNewCityNotes('');
  };

  const handleSaveOfficeLandmark = (id: string) => {
    setOffices((prev) =>
      prev.map((o) => (o.id === id ? { ...o, landmarkNote: landmarkNote || o.landmarkNote } : o))
    );
    setEditingOfficeId(null);
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
          <span>Verifying administrator authorization...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Admin Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-rose-500/20">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white">CAPTAIN NEXUS CONTROL PLANE</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 font-bold uppercase">
                Zone B Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400">admin.taxi.silenvault.com • {currentUser.email}</p>
          </div>
        </div>

        {/* Tab Controls & Sign Out */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('cities')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'cities' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manage Cities ({cities.length})
            </button>
            <button
              onClick={() => setActiveTab('offices')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'offices' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registered Offices ({offices.length})
            </button>
            <button
              onClick={() => setActiveTab('boundaries')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'boundaries' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GeoJSON Editor
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="px-3 py-1 text-xs rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tab 1: Cities Manager */}
        {activeTab === 'cities' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Add New City Form */}
            <div className="w-96 border-r border-slate-800 p-5 bg-slate-900/60 overflow-y-auto shrink-0">
              <h3 className="font-bold text-sm text-amber-400 mb-1">Add Operating City</h3>
              <p className="text-xs text-slate-400 mb-4">Register new clusters for captain onboarding.</p>

              <form onSubmit={handleAddCity} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Warangal"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Telangana"
                    value={newCityState}
                    onChange={(e) => setNewCityState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="17.9689"
                      value={newCityLat}
                      onChange={(e) => setNewCityLat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="79.5941"
                      value={newCityLng}
                      onChange={(e) => setNewCityLng(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Onboarding Landmark Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Office located above Bata showroom on 2nd floor"
                    value={newCityNotes}
                    onChange={(e) => setNewCityNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow"
                >
                  Save City To Live Database
                </button>
              </form>
            </div>

            {/* Existing Cities Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-200">Registered Operational Cities ({cities.length})</h3>
                <span className="text-xs text-slate-400">Toggle switches activate/deactivate clusters in real time</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 bg-slate-900/50">
                {cities.map((city) => (
                  <div key={city.id} className="p-3.5 flex items-center justify-between hover:bg-slate-800/40">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white">{city.name}</span>
                        <span className="text-[10px] text-slate-400">({city.state})</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                        </span>
                      </div>
                      {city.notes && (
                        <p className="text-[11px] text-amber-400/90 mt-1">Note: {city.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleCity(city.id)}
                        className={`px-3 py-1 text-[11px] rounded-lg font-bold transition-all ${
                          city.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {city.active ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Offices Manager */}
        {activeTab === 'offices' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm text-blue-400">Roppen Transportation Statutory Offices</h3>
              <span className="text-xs text-slate-400">Directly edit onboarding notes and physical landmarks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offices.map((office) => (
                <div key={office.id} className="p-5 rounded-xl border border-blue-500/30 bg-slate-900/70 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                        {office.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5">{office.name}</h4>
                      <div className="text-xs text-amber-400 font-medium">{office.legalEntity}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">CIN: {office.cin}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">{office.address}</p>

                  {/* Landmark note editor */}
                  {editingOfficeId === office.id ? (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        defaultValue={office.landmarkNote || ''}
                        onChange={(e) => setLandmarkNote(e.target.value)}
                        placeholder="Enter physical landmark note..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveOfficeLandmark(office.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOfficeId(null)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-xs text-cyan-400">
                        Landmark: {office.landmarkNote || 'None set'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingOfficeId(office.id);
                          setLandmarkNote(office.landmarkNote || '');
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        Edit Landmark
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: GeoJSON Boundary Editor */}
        {activeTab === 'boundaries' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h3 className="font-bold text-sm text-emerald-400">Custom Municipal Boundary & GeoJSON Editor</h3>
            <p className="text-xs text-slate-400">
              Paste or inspect raw GeoJSON polygons to overwrite boundaries for any active operating city.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Select City</label>
                <select
                  value={selectedCityId || ''}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="">-- Choose City --</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-semibold text-slate-300">Raw GeoJSON Polygon</label>
                <textarea
                  rows={10}
                  placeholder='{"type": "Polygon", "coordinates": [...]}'
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none"
                />

                <button
                  type="button"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow"
                >
                  Update & Publish Boundary
                </button>
              </div>

              <div className="col-span-2 border border-slate-800 rounded-xl p-4 bg-slate-900/30 flex items-center justify-center text-slate-500 text-xs">
                Map preview canvas will render the uploaded GeoJSON geometry before publishing.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

