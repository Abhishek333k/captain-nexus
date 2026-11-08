import { useState, useMemo } from 'react';
import { City, ServiceType, RAPIDO_OFFICIAL_CITIES } from './data/cities';
import { CityOffice, ROPPEN_STATUTORY_OFFICES } from './data/offices';
import { calculateHaversineDistance } from './utils/geo';
import { MapView } from './components/MapView';
import { SearchAutocomplete } from './components/SearchAutocomplete';
import { AdBanner } from './components/AdBanner';

const SERVICE_OPTIONS: { id: ServiceType; label: string }[] = [
  { id: 'bike', label: 'Bike Taxi' },
  { id: 'auto', label: 'Auto' },
  { id: 'cab', label: 'Cab' },
  { id: 'e_rickshaw', label: 'E-Rickshaw' },
  { id: 'tuk_tuk', label: 'Tuk-Tuk' },
  { id: 'b2b', label: 'B2B Delivery' }
];

export function App() {
  const [activeTab, setActiveTab] = useState<'cities' | 'offices'>('cities');
  const [cities] = useState<City[]>(RAPIDO_OFFICIAL_CITIES);
  const [offices] = useState<CityOffice[]>(ROPPEN_STATUTORY_OFFICES);
  const [radiusKm, setRadiusKm] = useState<number>(30); // 30km standard limit
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>('all');
  const [searchedLocation, setSearchedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Layer Visibility Controls (Prevent map visual clutter)
  const [showCityPins, setShowCityPins] = useState(true);
  const [showOfficePins, setShowOfficePins] = useState(false);
  const [showSurgeHexagons, setShowSurgeHexagons] = useState(true);

  // Direct selection from Google-style suggestive search autocomplete
  const handleSelectLocation = (loc: { name: string; lat: number; lng: number }) => {
    setIsSearching(true);
    setSearchedLocation(loc);
    setIsSearching(false);
  };

  // Instant Haversine distance ranking for Cities
  const rankedCities = useMemo(() => {
    let list = cities.filter((c) => c.active);

    if (selectedService !== 'all') {
      list = list.filter((c) => c.services.includes(selectedService));
    }

    if (!searchedLocation) {
      return list.map((c) => ({ ...c, distance: undefined }));
    }

    return list
      .map((c) => {
        const dist = calculateHaversineDistance(
          searchedLocation.lat,
          searchedLocation.lng,
          c.lat,
          c.lng
        );
        return { ...c, distance: dist };
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [cities, selectedService, searchedLocation]);

  // Instant Haversine distance ranking for Statutory Offices
  const rankedOffices = useMemo(() => {
    if (!searchedLocation) {
      return offices.map((o) => ({ ...o, distance: undefined }));
    }

    return offices
      .map((o) => {
        const dist = calculateHaversineDistance(
          searchedLocation.lat,
          searchedLocation.lng,
          o.lat,
          o.lng
        );
        return { ...o, distance: dist };
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [offices, searchedLocation]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-amber-400/20">
            R
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white">CAPTAIN NEXUS</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold">
                NETWORK RADAR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">95 Active Servicing Hubs • SilentVault Geospatial Intelligence</p>
          </div>
        </div>

        {/* Tab & Layer Controls */}
        <div className="flex items-center space-x-2">
          {/* Main List Mode */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('cities');
                setShowCityPins(true);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'cities'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Cities ({rankedCities.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('offices');
                setShowOfficePins(true);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'offices'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registered Offices ({rankedOffices.length})
            </button>
          </div>

          {/* Map Layer Toggles */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setShowCityPins((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showCityPins ? 'bg-amber-400/20 text-amber-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Cities: {showCityPins ? 'ON' : 'OFF'}
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setShowOfficePins((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showOfficePins ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Offices: {showOfficePins ? 'ON' : 'OFF'}
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setShowSurgeHexagons((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showSurgeHexagons ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Hex: {showSurgeHexagons ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Control Panel */}
        <div className="w-full md:w-[440px] lg:w-[480px] bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
            {/* Google-Style Suggestive Autocomplete Search Bar */}
            <SearchAutocomplete
              onSelectLocation={handleSelectLocation}
              isSearching={isSearching}
            />

            {/* Dynamic Commute Radius Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                <span className="font-semibold text-slate-400">
                  {activeTab === 'cities' ? 'Max Commute Limit:' : 'Proximity Radius:'}
                </span>
                <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {radiusKm} km
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Service Filter Matrix (Active in Cities tab) */}
            {activeTab === 'cities' && (
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Service Category Filter
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedService('all')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                      selectedService === 'all'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {SERVICE_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setSelectedService(opt.id)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                        selectedService === opt.id
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Context Banner */}
          {searchedLocation && (
            <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="truncate mr-2">
                <span className="text-slate-400">Target: </span>
                <span className="font-semibold text-amber-300 truncate">{searchedLocation.name}</span>
              </div>
              <button
                onClick={() => setSearchedLocation(null)}
                className="text-[11px] text-slate-400 hover:text-rose-400 shrink-0 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {/* AdSense Placement (Auto-collapses completely when no ad served) */}
          <AdBanner />

          {/* Tab 1: Active Cities List */}
          {activeTab === 'cities' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-400 px-1 mb-1">
                <span>Rapido Live Cities ({rankedCities.length})</span>
                <span>Sorted by Nearest Proximity</span>
              </div>

              {rankedCities.map((city, idx) => {
                const isEligible = city.distance !== undefined && city.distance <= radiusKm;
                return (
                  <div
                    key={city.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isEligible
                        ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-400 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <h4 className="text-sm font-bold text-white tracking-wide">{city.name}</h4>
                          <span className="text-[10px] text-slate-400">({city.state})</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {city.services.map((svc) => (
                            <span
                              key={svc}
                              className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold"
                            >
                              {svc.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {city.distance !== undefined ? (
                        <div className="text-right">
                          <div
                            className={`text-sm font-black ${
                              isEligible ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {city.distance} km
                          </div>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isEligible
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isEligible ? 'Eligible' : 'Out of Range'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded">
                          Active Hub
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Legally Verified Statutory Offices List */}
          {activeTab === 'offices' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-400 px-1 mb-1">
                <span>Roppen Transportation Statutory Offices ({rankedOffices.length})</span>
                <span>Distance to Reference Point</span>
              </div>

              {rankedOffices.map((office) => {
                const isNearby = office.distance !== undefined && office.distance <= radiusKm;
                return (
                  <div
                    key={office.id}
                    className="p-4 rounded-xl border bg-slate-950/90 border-blue-500/40 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="max-w-[80%]">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {office.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">CIN: {office.cin}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {office.name}
                        </h4>
                        <div className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                          {office.legalEntity}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-2 leading-snug">
                          {office.address}
                        </p>
                        <div className="text-[10px] text-slate-400 mt-2 flex flex-wrap gap-2">
                          <span>📍 PIN: {office.pincode}</span>
                          <span>🕒 {office.timing}</span>
                        </div>
                        <div className="text-[9px] text-emerald-400/90 mt-1.5 font-medium">
                          ✓ {office.statutorySource}
                        </div>
                      </div>

                      {office.distance !== undefined ? (
                        <div className="text-right">
                          <div className="text-sm font-black text-blue-400">
                            {office.distance} km
                          </div>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isNearby
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isNearby ? 'In Commute Reach' : 'National Office'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                          {office.city}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right / Interactive Map Canvas */}
        <div className="flex-1 h-full p-3 bg-slate-950 flex flex-col">
          <MapView
            cities={rankedCities}
            offices={rankedOffices}
            searchedLocation={searchedLocation}
            radiusKm={radiusKm}
            showSurgeHexagons={showSurgeHexagons}
            showCityPins={showCityPins}
            showOfficePins={showOfficePins}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
