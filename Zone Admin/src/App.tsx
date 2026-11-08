import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import { AdminLogin } from './components/AdminLogin';
import { RAPIDO_OFFICIAL_CITIES, City } from '../../Zone Rapido/src/data/cities';
import { ROPPEN_STATUTORY_OFFICES, CityOffice } from '../../Zone Rapido/src/data/offices';

const AUTHORIZED_ADMIN_EMAILS = [
  'mabhishekramesh1@gmail.com'
];

function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) return true;
  if (cleanEmail.endsWith('@silenvault.com')) return true;
  return false;
}

type FleetPlatform = 'rapido' | 'uber' | 'ola';

export default function AdminApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  // Navigation: Active Fleet Platform (null = Hub Overview, 'rapido' = Rapido Manager)
  const [selectedFleet, setSelectedFleet] = useState<FleetPlatform | null>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/rapido')) return 'rapido';
    if (path.includes('/uber')) return 'uber';
    if (path.includes('/ola')) return 'ola';
    return null;
  });

  const [activeTab, setActiveTab] = useState<'cities' | 'offices' | 'boundaries'>('cities');
  const [cities, setCities] = useState<City[]>(RAPIDO_OFFICIAL_CITIES);
  const [offices, setOffices] = useState<CityOffice[]>(ROPPEN_STATUTORY_OFFICES);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  // Splash auto dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/rapido')) setSelectedFleet('rapido');
      else if (path.includes('/uber')) setSelectedFleet('uber');
      else if (path.includes('/ola')) setSelectedFleet('ola');
      else setSelectedFleet(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!isAuthorizedAdmin(user.email)) {
          await signOut(auth);
          setCurrentUser(null);
          setIsAuthLoading(false);
          return;
        }
      }
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

  const navigateToFleet = (fleet: FleetPlatform | null) => {
    setSelectedFleet(fleet);
    if (fleet) {
      window.history.pushState({}, '', `/${fleet}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

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
      {/* SilenVault Splash Screen */}
      {isSplashLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-300">
          <div className="relative flex flex-col items-center">
            <div className="w-24 h-24 mb-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-2xl flex items-center justify-center">
              <img src="/silenvault-logo.svg" alt="SilenVault Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-lg font-black text-white tracking-widest uppercase">SILENVAULT</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Mobility Fleet Operations Control Plane</p>
            <div className="mt-5 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[11px] text-slate-500 font-mono">Authenticating session...</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700/80 p-1.5 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <img src="/silenvault-logo.svg" alt="SilenVault" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white">SILENVAULT MOBILITY</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 font-bold uppercase">
                Zone Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400">admin.taxi.silenvault.com • {currentUser.email}</p>
          </div>
        </div>

        {/* Global Action & Sign Out */}
        <div className="flex items-center space-x-3">
          {selectedFleet && (
            <button
              onClick={() => navigateToFleet(null)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-amber-400 font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span>&larr;</span>
              <span>All Fleets</span>
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* MAIN VIEW AREA: Either Hub Fleet Cards (when selectedFleet is null) OR Platform Manager */}
      {!selectedFleet ? (
        /* ================= 1. FLEET HUB DASHBOARD (CARDS VIEW) ================= */
        <main className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full flex flex-col justify-center">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Operations Control Plane</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Select Fleet Management Dashboard
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl mx-auto">
              Choose the transport fleet platform to manage operating city coverages, statutory offices, and municipal GeoJSON boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Rapido Fleet (Active) */}
            <div
              onClick={() => navigateToFleet('rapido')}
              className="group cursor-pointer rounded-2xl border border-amber-400/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl hover:border-amber-400 hover:scale-[1.02] transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-400/20">
                  R
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active System
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                Rapido Operations
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Manage 95 operating cities, Roppen statutory offices, service categories (Bike, Auto, Cab), and custom GeoJSON polygon boundaries.
              </p>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-mono">
                  <span>95 Cities • 35 Offices</span>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Open Console &rarr;
                </span>
              </div>
            </div>

            {/* Card 2: Uber Fleet (Upcoming) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 opacity-60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-xl border border-slate-700">
                    U
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Upcoming
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">Uber India Fleet</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated dataset, hub coverage, and regulatory compliance records for Uber India Technologies.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                Platform Dataset Locked
              </div>
            </div>

            {/* Card 3: Ola Fleet (Upcoming) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 opacity-60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/20">
                    O
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Upcoming
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">Ola Mobility</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ANI Technologies registered hub nodes, service radius controls, and statutory depot locations.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                Platform Dataset Locked
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ================= 2. SPECIFIC PLATFORM MANAGEMENT CONSOLE ================= */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub-header for Active Fleet Platform */}
          <div className="h-12 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateToFleet(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 font-semibold"
              >
                <span>&larr;</span>
                <span>Fleet Dashboard</span>
              </button>
              <span className="text-slate-600">/</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="font-bold text-xs uppercase text-amber-400 tracking-wider">
                  {selectedFleet} Control Plane
                </span>
              </div>
            </div>

            {/* Inner Tabs for the Active Fleet */}
            <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('cities')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'cities' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Operating Cities ({cities.length})
              </button>
              <button
                onClick={() => setActiveTab('offices')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'offices' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Registered Offices ({offices.length})
              </button>
              <button
                onClick={() => setActiveTab('boundaries')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'boundaries' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GeoJSON Boundary Editor
              </button>
            </div>
          </div>

          {/* Tab 1: Manage Cities */}
          {activeTab === 'cities' && (
            <div className="flex-1 flex overflow-hidden">
              {/* City List */}
              <div className="w-1/2 border-r border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Active Coverage Directory ({cities.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">Roppen Network</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="p-3 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-white">{city.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {city.state}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleCity(city.id)}
                          className={`px-2 py-1 text-[11px] font-bold rounded ${
                            city.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {city.active ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New City Form */}
              <div className="w-1/2 p-6 overflow-y-auto bg-slate-900/20">
                <h3 className="font-bold text-sm text-amber-400 mb-2">Register New Operating City</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Add a new municipal hub to Rapido's active operating network. Updates will reflect on rapido.taxi.silenvault.com.
                </p>

                <form onSubmit={handleAddCity} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhagalpur"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State / Region</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bihar"
                      value={newCityState}
                      onChange={(e) => setNewCityState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="25.2425"
                        value={newCityLat}
                        onChange={(e) => setNewCityLat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="86.9842"
                        value={newCityLng}
                        onChange={(e) => setNewCityLng(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Pilot deployment phase"
                      value={newCityNotes}
                      onChange={(e) => setNewCityNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-lg shadow-amber-400/20"
                  >
                    Add City to Rapido Network
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Manage Offices */}
          {activeTab === 'offices' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-sm text-blue-400">Roppen Transportation Statutory Offices ({offices.length})</h3>
                  <p className="text-xs text-slate-400">Manage registered corporate and regional address landmarks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offices.map((office) => (
                  <div
                    key={office.id}
                    className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-white">{office.name}</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                        {office.state}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{office.address}</p>

                    {editingOfficeId === office.id ? (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <input
                          type="text"
                          value={landmarkNote}
                          placeholder="e.g. Near Metro Pillar 14"
                          onChange={(e) => setLandmarkNote(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveOfficeLandmark(office.id)}
                            className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingOfficeId(null)}
                            className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[10px] rounded"
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
      )}
    </div>
  );
}
