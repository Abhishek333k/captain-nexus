import { useState, useMemo, useEffect } from 'react';
import { City, ServiceType, RAPIDO_OFFICIAL_CITIES } from './data/cities';
import { CityOffice, ROPPEN_STATUTORY_OFFICES } from './data/offices';
import { fetchBulkRoadDistances } from './utils/geo';
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

  // Theme & State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [roadDistances, setRoadDistances] = useState<Record<string, number>>({});
  const [isCalculatingRoad, setIsCalculatingRoad] = useState(false);

  // Layer Visibility Controls
  const [showCityPins, setShowCityPins] = useState(true);
  const [showOfficePins, setShowOfficePins] = useState(false);
  const [showSurgeHexagons, setShowSurgeHexagons] = useState(true);

  const handleSelectLocation = (loc: { name: string; lat: number; lng: number }) => {
    setIsSearching(true);
    setSearchedLocation(loc);
    setIsSearching(false);
  };

  // Pure Road Distance ranking for Cities
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
        const roadDist = roadDistances[c.id];
        return {
          ...c,
          distance: roadDist
        };
      })
      .sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
  }, [cities, selectedService, searchedLocation, roadDistances]);

  // Pure Road Distance ranking for Statutory Offices
  const rankedOffices = useMemo(() => {
    if (!searchedLocation) {
      return offices.map((o) => ({ ...o, distance: undefined }));
    }

    return offices
      .map((o) => {
        const roadDist = roadDistances[o.id];
        return {
          ...o,
          distance: roadDist
        };
      })
      .sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
  }, [offices, searchedLocation, roadDistances]);

  // Automatically calculate true road distances via OSRM Table API when reference location is selected
  useEffect(() => {
    if (!searchedLocation) return;

    let isMounted = true;
    async function resolveRoadDistances() {
      setIsCalculatingRoad(true);

      const destinations = [
        ...cities.map((c) => ({ id: c.id, lat: c.lat, lng: c.lng })),
        ...offices.map((o) => ({ id: o.id, lat: o.lat, lng: o.lng }))
      ];

      const resolved = await fetchBulkRoadDistances(
        searchedLocation!.lat,
        searchedLocation!.lng,
        destinations
      );

      if (isMounted && Object.keys(resolved).length > 0) {
        setRoadDistances(resolved);
      }
      setIsCalculatingRoad(false);
    }

    resolveRoadDistances();
    return () => {
      isMounted = false;
    };
  }, [searchedLocation, cities, offices]);

  return (
    <div
      className={`flex flex-col h-screen w-screen select-none overflow-hidden font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Navbar */}
      <header
        className={`h-14 border-b px-4 flex items-center justify-between shrink-0 transition-colors ${
          isDarkMode
            ? 'border-slate-800 bg-slate-900/90'
            : 'border-slate-200 bg-white/95 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-amber-400/20">
            R
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-sm tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                CAPTAIN NEXUS
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold">
                NETWORK RADAR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">95 Active Servicing Hubs • SilentVault Geospatial Intelligence</p>
          </div>
        </div>

        {/* Tab & Feature Controls */}
        <div className="flex items-center space-x-2">
          {/* Main List Mode */}
          <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => {
                setActiveTab('cities');
                setShowCityPins(true);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'cities'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
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
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              Registered Offices ({rankedOffices.length})
            </button>
          </div>

          {/* Road Distance Status Indicator */}
          {isCalculatingRoad && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Calculating Road Routes...</span>
            </div>
          )}

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            title="Toggle Dark/Light Mode"
            className={`px-2.5 py-1 text-xs rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>

          {/* Map Layer Toggles */}
          <div className={`hidden xl:flex items-center space-x-1.5 px-2 py-1 rounded-xl border text-[11px] ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setShowCityPins((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showCityPins ? 'bg-amber-400/20 text-amber-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Cities: {showCityPins ? 'ON' : 'OFF'}
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => setShowOfficePins((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showOfficePins ? 'bg-blue-500/20 text-blue-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Offices: {showOfficePins ? 'ON' : 'OFF'}
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => setShowSurgeHexagons((prev) => !prev)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                showSurgeHexagons ? 'bg-emerald-500/20 text-emerald-500' : 'text-slate-400 hover:text-slate-600'
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
        <div
          className={`w-full md:w-[440px] lg:w-[480px] border-r flex flex-col h-full shrink-0 transition-colors ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`p-4 border-b space-y-3 shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            {/* Google-Style Suggestive Autocomplete Search Bar */}
            <SearchAutocomplete
              onSelectLocation={handleSelectLocation}
              isSearching={isSearching}
            />

            {/* Dynamic Commute Radius Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeTab === 'cities' ? 'Max Commute Limit:' : 'Proximity Radius:'}
                </span>
                <span className="font-bold text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
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
                className="w-full accent-amber-400 h-1.5 bg-slate-700/50 rounded-lg cursor-pointer"
              />
            </div>

            {/* Service Filter Matrix (Active in Cities tab) */}
            {activeTab === 'cities' && (
              <div>
                <span className={`block text-[11px] font-semibold mb-1.5 uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Service Category Filter
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedService('all')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                      selectedService === 'all'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow'
                        : isDarkMode
                        ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
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
                          : isDarkMode
                          ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
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
            <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="truncate mr-2">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Target: </span>
                <span className="font-semibold text-amber-500 truncate">{searchedLocation.name}</span>
              </div>
              <button
                onClick={() => setSearchedLocation(null)}
                className="text-[11px] text-slate-400 hover:text-rose-500 shrink-0 font-medium"
              >
                Clear
              </button>
            </div>
          )}

          {/* AdSense Placement */}
          <AdBanner />

          {/* Tab 1: Active Cities List */}
          {activeTab === 'cities' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-400 px-1 mb-1">
                <span>Rapido Live Cities ({rankedCities.length})</span>
                <span>Road Transportation Distance</span>
              </div>

              {rankedCities.map((city, idx) => {
                const currentDistance = city.distance;
                const isEligible = currentDistance !== undefined && currentDistance <= radiusKm;
                return (
                  <div
                    key={city.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isEligible
                        ? isDarkMode
                          ? 'bg-slate-950/90 border-emerald-500/40 hover:border-emerald-400 shadow-sm'
                          : 'bg-white border-emerald-500/50 hover:border-emerald-500 shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="max-w-[70%]">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <h4 className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {city.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">({city.state})</span>
                        </div>

                        {city.notes && (
                          <p className="text-[11px] text-amber-500/90 mt-1 leading-snug">
                            Note: {city.notes}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {city.services.map((svc) => (
                            <span
                              key={svc}
                              className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold ${
                                isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {svc.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {currentDistance !== undefined ? (
                        <div className="text-right shrink-0">
                          <div
                            className={`text-sm font-black ${
                              isEligible ? 'text-emerald-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            {currentDistance} km
                          </div>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isEligible
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : isDarkMode
                                ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                : 'bg-slate-200 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {isEligible ? 'Eligible' : 'Out of Range'}
                          </span>
                        </div>
                      ) : (
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          isDarkMode ? 'bg-slate-800/60 text-slate-500' : 'bg-slate-200 text-slate-600'
                        }`}>
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
                <span>Road Transportation Distance</span>
              </div>

              {rankedOffices.map((office) => {
                const currentDistance = office.distance;
                const isNearby = currentDistance !== undefined && currentDistance <= radiusKm;
                return (
                  <div
                    key={office.id}
                    className={`p-4 rounded-xl border shadow-sm ${
                      isDarkMode ? 'bg-slate-950/90 border-blue-500/40' : 'bg-white border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="max-w-[75%]">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {office.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">CIN: {office.cin}</span>
                        </div>
                        <h4 className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {office.name}
                        </h4>
                        <div className="text-[11px] text-amber-500 font-medium mt-0.5">
                          {office.legalEntity}
                        </div>
                        <p className={`text-[11px] mt-2 leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {office.address}
                        </p>
                        {office.landmarkNote && (
                          <p className="text-[11px] text-cyan-500 mt-1 font-medium">
                            Landmark: {office.landmarkNote}
                          </p>
                        )}
                        <div className="text-[10px] text-slate-400 mt-2 flex flex-wrap gap-2">
                          <span>PIN: {office.pincode}</span>
                          <span>Timing: {office.timing}</span>
                        </div>
                        <div className="text-[9px] text-emerald-500 mt-1.5 font-medium">
                          Source: {office.statutorySource}
                        </div>
                      </div>

                      {currentDistance !== undefined ? (
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-blue-500">
                            {currentDistance} km
                          </div>
                          <span
                            className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isNearby
                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                : isDarkMode
                                ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                : 'bg-slate-200 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {isNearby ? 'In Reach' : 'National Office'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
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
        <div className={`flex-1 h-full p-3 flex flex-col ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
          <MapView
            cities={rankedCities}
            offices={rankedOffices}
            searchedLocation={searchedLocation}
            radiusKm={radiusKm}
            showSurgeHexagons={showSurgeHexagons}
            showCityPins={showCityPins}
            showOfficePins={showOfficePins}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
