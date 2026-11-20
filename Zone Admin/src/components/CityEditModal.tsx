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
  const [address, setAddress] = useState(city.address || '');
  const [landmarkNote, setLandmarkNote] = useState(city.landmarkNote || '');
  const [pincode, setPincode] = useState(city.pincode || '');
  const [notes, setNotes] = useState(city.notes || '');
  const [active, setActive] = useState(city.active);
  const [clusterId, setClusterId] = useState(city.clusterId || '');
  const [clusterName, setClusterName] = useState(city.clusterName || '');
  const [parentHubId, setParentHubId] = useState(city.parentHubId || '');
  const [isSubDistrict, setIsSubDistrict] = useState(city.isSubDistrict || false);
  const [payslabTier, setPayslabTier] = useState<string>(city.payslabTier || 'urban_tier2');
  const [baseFare, setBaseFare] = useState(city.payslabSummary?.baseFare?.toString() || '');
  const [perKmRate, setPerKmRate] = useState(city.payslabSummary?.perKmRate?.toString() || '');
  const [captainPayoutPercent, setCaptainPayoutPercent] = useState(city.payslabSummary?.captainPayoutPercent?.toString() || '80');
  const [interZoneSurcharge, setInterZoneSurcharge] = useState(city.payslabSummary?.interZoneSurcharge?.toString() || '');
  const [crossDispatchEnabled, setCrossDispatchEnabled] = useState(city.crossDispatchEnabled ?? true);

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
      address: address.trim() || undefined,
      landmarkNote: landmarkNote.trim() || undefined,
      pincode: pincode.trim() || undefined,
      notes: notes.trim() || undefined,
      active,
      clusterId: clusterId.trim() || undefined,
      clusterName: clusterName.trim() || undefined,
      parentHubId: parentHubId.trim() || undefined,
      isSubDistrict,
      payslabTier: payslabTier as any,
      payslabSummary: baseFare ? {
        baseFare: parseFloat(baseFare) || 20,
        perKmRate: parseFloat(perKmRate) || 8.0,
        captainPayoutPercent: parseFloat(captainPayoutPercent) || 80,
        minFare: parseFloat(baseFare) || 20,
        interZoneSurcharge: interZoneSurcharge ? parseFloat(interZoneSurcharge) : undefined
      } : city.payslabSummary,
      crossDispatchEnabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto p-6 text-slate-100">
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

          {/* Physical City Office Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <span>🏢</span>
                <span>Physical City Office Address</span>
              </label>
              <span className="text-[10px] text-amber-400 font-mono">Statutory / Operations Hub</span>
            </div>
            <textarea
              rows={2}
              placeholder="e.g. 3rd Floor, Sai Prithvi Arcade, Megha Hills, Madhapur"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Landmark Hint & Pincode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Landmark Hint / Direction</label>
              <input
                type="text"
                placeholder="e.g. Near Kavuri Hills junction"
                value={landmarkNote}
                onChange={(e) => setLandmarkNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Pincode</label>
              <input
                type="text"
                placeholder="e.g. 500081"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Notes (Demand / Timings)</label>
            <input
              type="text"
              placeholder="e.g. Corporate HQ hub • 24x7 service availability"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Regional Transit Cluster & Parent Hub Linking */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">🌐</span>
                <span className="text-xs font-bold text-purple-300">Regional Transit Cluster & Conurbation</span>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">VGTM / NCR Architecture</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cluster ID</label>
                <input
                  type="text"
                  placeholder="e.g. pan_vijayawada"
                  value={clusterId}
                  onChange={(e) => setClusterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cluster Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pan-Vijayawada (VGTM)"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Parent Hub City ID</label>
                <input
                  type="text"
                  placeholder="e.g. vijayawada"
                  value={parentHubId}
                  onChange={(e) => setParentHubId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payslab Tariff Tier</label>
                <select
                  value={payslabTier}
                  onChange={(e) => setPayslabTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="metro_tier1">Tier 1 Metro (₹35 base)</option>
                  <option value="urban_tier2">Tier 2 Urban (₹25 base)</option>
                  <option value="suburban_tier3">Tier 3 Suburban (₹20 base)</option>
                  <option value="corridor">Inter-City Corridor</option>
                </select>
              </div>
            </div>

            {/* Fare Matrix & Payout Inputs */}
            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-purple-500/20">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Base Fare (₹)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={baseFare}
                  onChange={(e) => setBaseFare(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Per Km (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="9.5"
                  value={perKmRate}
                  onChange={(e) => setPerKmRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Payout %</label>
                <input
                  type="number"
                  placeholder="80"
                  value={captainPayoutPercent}
                  onChange={(e) => setCaptainPayoutPercent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Toll / Surcharge</label>
                <input
                  type="number"
                  placeholder="15"
                  value={interZoneSurcharge}
                  onChange={(e) => setInterZoneSurcharge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSubDistrict}
                  onChange={(e) => setIsSubDistrict(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">Sub-District / Peripheral Municipality</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crossDispatchEnabled}
                  onChange={(e) => setCrossDispatchEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-purple-600 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">Allow Cross-Cluster Dispatch</span>
              </label>
            </div>
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
