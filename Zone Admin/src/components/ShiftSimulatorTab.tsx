import React, { useState, useMemo } from 'react';
import { City } from '../../../Zone Rapido/src/data/cities';

interface ShiftSimulatorTabProps {
  cities: City[];
}

export type ShiftMode = 'single_zone' | 'cluster_wide' | 'corridor_express';

export const ShiftSimulatorTab: React.FC<ShiftSimulatorTabProps> = ({ cities }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('vijayawada');
  const [shiftMode, setShiftMode] = useState<ShiftMode>('cluster_wide');
  const [vehicleType, setVehicleType] = useState<'bike' | 'auto' | 'cab'>('bike');

  // Test Trip Origin & Destination
  const [testDropoffCityId, setTestDropoffCityId] = useState<string>('guntur');
  const [testTripDistanceKm, setTestTripDistanceKm] = useState<number>(32);

  const homeCity = useMemo(() => {
    return cities.find((c) => c.id === selectedCityId) || cities[0];
  }, [cities, selectedCityId]);

  const dropoffCity = useMemo(() => {
    return cities.find((c) => c.id === testDropoffCityId) || cities[1];
  }, [cities, testDropoffCityId]);

  // Find all member cities in the same cluster
  const clusterMemberCities = useMemo(() => {
    if (!homeCity?.clusterId) return [homeCity];
    return cities.filter((c) => c.clusterId === homeCity.clusterId);
  }, [cities, homeCity]);

  // Compute eligible dispatch zones based on shift mode
  const eligibleDispatchZones = useMemo(() => {
    if (!homeCity) return [];
    if (shiftMode === 'single_zone') {
      return [homeCity];
    }
    if (shiftMode === 'cluster_wide') {
      return clusterMemberCities;
    }
    // corridor express: home city + connected corridor zones
    const connected = homeCity.connectedZoneIds || [];
    return cities.filter((c) => c.id === homeCity.id || connected.includes(c.id));
  }, [homeCity, shiftMode, clusterMemberCities, cities]);

  const isCrossZone = homeCity?.id !== dropoffCity?.id;
  const isSameCluster = Boolean(
    homeCity?.clusterId && dropoffCity?.clusterId && homeCity.clusterId === dropoffCity.clusterId
  );
  const isInterCluster = Boolean(
    homeCity?.clusterId && dropoffCity?.clusterId && homeCity.clusterId !== dropoffCity.clusterId
  );

  // Speed estimates based on vehicle type
  const avgSpeedKmh = useMemo(() => {
    switch (vehicleType) {
      case 'bike': return 35;
      case 'auto': return 28;
      case 'cab': return 45;
      default: return 30;
    }
  }, [vehicleType]);

  const estimatedMinutes = Math.round((testTripDistanceKm / avgSpeedKmh) * 60);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Captain Shift & Regional Transit Dispatch Simulator
            </h2>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Multi-Zone Conurbation Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate regional transit boundaries, dispatch radii, and return corridor pairing across contiguous transit zones (e.g. Pan-Vijayawada VGTM, Delhi NCR).
          </p>
        </div>
      </div>

      {/* Control Grid: Captain Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Captain Home Hub */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">1. Captain Registered Home Base</span>
            <span className="text-[10px] text-amber-400 font-mono">Anchor Node</span>
          </div>

          <select
            value={selectedCityId}
            onChange={(e) => {
              setSelectedCityId(e.target.value);
              const newHome = cities.find((c) => c.id === e.target.value);
              if (newHome?.connectedZoneIds && newHome.connectedZoneIds.length > 0) {
                setTestDropoffCityId(newHome.connectedZoneIds[0]);
              }
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} {city.clusterName ? `• [${city.clusterName.split('(')[0].trim()}]` : ''}
              </option>
            ))}
          </select>

          {homeCity && (
            <div className="text-[11px] space-y-1 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono">
              <div className="text-amber-300 font-bold">{homeCity.name} ({homeCity.state})</div>
              {homeCity.clusterName ? (
                <div className="text-purple-300">Cluster: {homeCity.clusterName}</div>
              ) : (
                <div className="text-slate-500">Autonomous Municipal Zone</div>
              )}
              {homeCity.parentHubId && (
                <div className="text-blue-300">Parent Hub: {homeCity.parentHubId}</div>
              )}
              {homeCity.isSubDistrict && (
                <div className="text-emerald-300">Sub-District / Peripheral Corridor</div>
              )}
              {homeCity.address && (
                <div className="text-slate-400 truncate">Office: {homeCity.address}</div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Shift Operating Mode */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">2. Active Shift Policy</span>
            <span className="text-[10px] text-purple-400 font-mono">Dispatch Filter</span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShiftMode('cluster_wide')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                shiftMode === 'cluster_wide'
                  ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg shadow-purple-900/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Pan-Cluster Multi-Zone (Recommended)</span>
                {shiftMode === 'cluster_wide' && <span className="text-purple-400">✓</span>}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Eligible across all contiguous cluster zones (e.g. Vijayawada + Tadepalli + Guntur).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setShiftMode('corridor_express')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                shiftMode === 'corridor_express'
                  ? 'bg-amber-900/40 border-amber-400 text-white shadow-lg shadow-amber-900/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Highway Transit Corridor</span>
                {shiftMode === 'corridor_express' && <span className="text-amber-400">✓</span>}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Restricted to high-speed express corridors connecting twin cities via highway spine.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setShiftMode('single_zone')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                shiftMode === 'single_zone'
                  ? 'bg-blue-900/40 border-blue-400 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>Single Municipal Zone (Strict Local)</span>
                {shiftMode === 'single_zone' && <span className="text-blue-400">✓</span>}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Confined strictly within municipal limits. No cross-border rides offered.
              </p>
            </button>
          </div>
        </div>

        {/* Card 3: Vehicle Type & Transit Operational Profile */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">3. Vehicle Profile & Operational Range</span>
            <span className="text-[10px] text-emerald-400 font-mono">Fleet Class</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['bike', 'auto', 'cab'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setVehicleType(type)}
                className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                  vehicleType === type
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Average Cruise Speed:</span>
              <span className="font-mono text-white">{avgSpeedKmh} km/h</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Highway Permitted:</span>
              <span className="font-mono text-emerald-400 font-bold">{vehicleType === 'auto' ? 'Secondary Lanes' : 'Express Corridor'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Max Shift Dispatch Radius:</span>
              <span className="font-mono text-purple-400">{vehicleType === 'bike' ? '45 km' : vehicleType === 'cab' ? '65 km' : '25 km'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Reverse Return Priority:</span>
              <span className="font-mono text-amber-300">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Dispatch Zones Display */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>📍</span>
              <span>Eligible Ride Dispatch Zones ({eligibleDispatchZones.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ride requests originating within these municipal borders will ring on the Captain terminal during this shift.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {shiftMode.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {eligibleDispatchZones.map((zone) => {
            const isAnchor = zone.id === homeCity.id;
            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isAnchor
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{zone.name}</span>
                  {isAnchor ? (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                      HOME BASE
                    </span>
                  ) : (
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 font-medium px-1.5 py-0.2 rounded">
                      CONNECTED
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{zone.state}</span>
                  <span className="font-mono text-[10px] text-purple-300">
                    {zone.clusterName ? zone.clusterName.split('(')[0].trim() : 'Local Zone'}
                  </span>
                </div>
                {zone.address && (
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">🏢 {zone.address}</p>
                )}
                {zone.notes && (
                  <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1">{zone.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Trip Dispatch & Deadhead Return Simulator */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">⚡</span>
            <h3 className="text-sm font-bold text-white">Transit Corridor & Deadhead Return Protocol Simulation</h3>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">Transit Corridor Test</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup (Origin)</label>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono flex items-center justify-between">
              <span>{homeCity?.name}</span>
              <span className="text-amber-400 text-[10px]">ANCHOR</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dropoff (Destination)</label>
            <select
              value={testDropoffCityId}
              onChange={(e) => setTestDropoffCityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated Road Distance: <span className="text-amber-400 font-mono">{testTripDistanceKm} km</span>
            </label>
            <input
              type="range"
              min={2}
              max={65}
              value={testTripDistanceKm}
              onChange={(e) => setTestTripDistanceKm(parseInt(e.target.value))}
              className="w-full accent-purple-500 mt-2"
            />
          </div>
        </div>

        {/* Simulation Output Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/90 border border-purple-500/30">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Transit Duration</span>
            <div className="text-xl font-black text-white mt-0.5">~{estimatedMinutes} mins</div>
            <p className="text-[10px] text-slate-500">Based on {avgSpeedKmh} km/h {vehicleType} average velocity</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Corridor Boundary Status</span>
            <div className="text-xs font-bold text-emerald-300 mt-1">
              {isSameCluster ? 'Contiguous Conurbation' : isInterCluster ? 'Inter-Cluster Cross Border' : 'Single Zone Local'}
            </div>
            <p className="text-[10px] text-slate-500">
              {isSameCluster ? 'Free transit handshake' : isInterCluster ? 'Permit / Highway link' : 'Intra-city transit'}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Dispatch Handshake</span>
            <div className="text-xs font-bold text-purple-300 mt-1">
              {eligibleDispatchZones.some(z => z.id === dropoffCity.id) ? 'Permitted In Shift Policy' : 'Outside Selected Shift Range'}
            </div>
            <p className="text-[10px] text-slate-500">Shift policy coverage validation</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Deadhead Return Logic</span>
            <div className="text-xs font-bold text-amber-300 mt-1">
              {isCrossZone ? 'Priority Reverse Queue' : 'Local Dropoff (No Deadhead)'}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isCrossZone
                ? 'Matches return rides towards Home Base to prevent empty return driving.'
                : 'Eligible for immediate next local pickup.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
