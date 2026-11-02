import React, { useState, useEffect } from 'react';
import { UserProfile, CampusNode, Match } from '../types';
import * as api from '../api';
import {
  Compass,
  Radio,
  MapPin,
  ShieldAlert,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  Heart,
  Eye,
  RefreshCw,
  Building2,
  CheckCircle2,
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';

interface CampusRadarViewProps {
  currentUser: UserProfile;
  profiles: UserProfile[];
  onLike: (profile: UserProfile, type?: 'like' | 'superlike') => Promise<{ isMatch: boolean; match?: Match }>;
  onSelectProfile: (profile: UserProfile) => void;
  onFilterChange: (filters: any) => void;
  filters: any;
  isLoading: boolean;
}

export const CampusRadarView: React.FC<CampusRadarViewProps> = ({
  currentUser,
  profiles,
  onLike,
  onSelectProfile,
  onFilterChange,
  filters,
  isLoading
}) => {
  const [radarNodes, setRadarNodes] = useState<CampusNode[]>([]);
  const [selectedBlipProfile, setSelectedBlipProfile] = useState<UserProfile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPulse, setScanPulse] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Load campus radar nodes
  useEffect(() => {
    api.fetchRadarNodes()
      .then(res => setRadarNodes(res.nodes))
      .catch(err => console.error('Failed to load radar nodes', err));
  }, []);

  const triggerScan = () => {
    setIsScanning(true);
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 1200);
    setTimeout(() => setIsScanning(false), 800);
  };

  // Convert distance and bearing into radar normalized coordinates (percentage within circle)
  const maxRange = filters.radiusKm && Number(filters.radiusKm) > 0 ? Number(filters.radiusKm) : 350;

  const getBlipCoordinates = (distanceKm: number = 10, bearing: number = 0) => {
    // Normalization factor: non-linear log or sqrt scale so near blips don't clump at the center
    const normalizedDist = Math.min(1, Math.sqrt(distanceKm / Math.max(maxRange, 20)));
    // Radius in percentage from center (center is 50%, 50%, max outer edge radius is 44%)
    const radiusPct = normalizedDist * 42;
    // Convert compass bearing (0 = North, 90 = East, 180 = South, 270 = West) to radians
    const angleRad = (bearing - 90) * (Math.PI / 180);
    const x = 50 + radiusPct * Math.cos(angleRad);
    const y = 50 + radiusPct * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Radar Header & Scope Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-[#ded3c5] bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e5e9] px-3 py-1 text-xs font-bold text-[#b64d70]">
            <Radio className="h-3.5 w-3.5 animate-pulse text-[#b64d70]" />
            <span>Proximity Radar & Distance Scanner</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#49233f]">
            Nearby Distance Estimates & Proximity
          </h2>
          <p className="text-xs text-[#786172]">
            Base Area: <strong className="text-[#49233f]">{currentUser.locationArea || currentUser.campusZone || 'Nairobi Central'}</strong>
            · <span className="font-medium text-emerald-700">{profiles.length} consenting adult members detected nearby</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick distance radius presets */}
          {[
            { label: '3 km · Walking', value: 3, tip: 'Immediate walking distance' },
            { label: '10 km · Local', value: 10, tip: 'Short ride or neighborhood' },
            { label: '25 km · Metro', value: 25, tip: 'Metro & citywide transit' },
            { label: '50 km · Greater', value: 50, tip: 'Greater area / regional' },
            { label: 'All Kenya', value: 'all', tip: 'All distance ranges' },
          ].map(r => (
            <button
              key={r.label}
              onClick={() => onFilterChange({ ...filters, radiusKm: r.value })}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                String(filters.radiusKm) === String(r.value) || (r.value === 'all' && (!filters.radiusKm || filters.radiusKm === 'all'))
                  ? 'bg-[#b64d70] text-white shadow-xs'
                  : 'bg-[#faf6f2] text-[#6b5263] border border-[#e8ded3] hover:bg-[#f3ede6]'
              }`}
              title={r.tip}
            >
              {r.label}
            </button>
          ))}

          <button
            onClick={triggerScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 rounded-xl bg-[#49233f] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#381a30] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Ping Radar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Screen (Left) + Intra-University Filter Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Radar Visualizer (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#ded3c5] bg-[#1d121c] p-6 shadow-xl relative overflow-hidden flex flex-col items-center select-none">
          
          {/* Radar background glow & grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#49233f_0%,#190b17_75%)] opacity-80" />

          {/* Compass labels */}
          <span className="absolute top-3 text-[10px] font-bold tracking-widest text-[#d8a8c2]/80 uppercase">North · Nairobi</span>
          <span className="absolute bottom-3 text-[10px] font-bold tracking-widest text-[#d8a8c2]/80 uppercase">South · Rift / Karen</span>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-[#d8a8c2]/80 uppercase">West · Kisumu</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-[#d8a8c2]/80 uppercase">East · Thika</span>

          {/* The Radar Disc */}
          <div className="relative w-full max-w-[420px] aspect-square rounded-full border border-[#b64d70]/40 my-4 flex items-center justify-center overflow-hidden">
            
            {/* Concentric distance rings */}
            <div className="absolute w-[80%] aspect-square rounded-full border border-dashed border-[#b64d70]/25 pointer-events-none" />
            <div className="absolute w-[56%] aspect-square rounded-full border border-[#b64d70]/30 pointer-events-none" />
            <div className="absolute w-[32%] aspect-square rounded-full border border-dashed border-[#b64d70]/35 pointer-events-none" />
            <div className="absolute w-[12%] aspect-square rounded-full border border-[#b64d70]/50 pointer-events-none" />

            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-[#b64d70]/20 pointer-events-none" />
            <div className="absolute left-0 right-0 h-[1px] bg-[#b64d70]/20 pointer-events-none" />

            {/* Sweep Beam animation */}
            <div className="absolute inset-0 pointer-events-none origin-center animate-[spin_4s_linear_infinite]">
              <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent via-[#b64d70]/15 to-[#d4af37]/40 rounded-tl-full" />
            </div>

            {/* Pulse wave animation on ping */}
            {scanPulse && (
              <div className="absolute inset-0 rounded-full border-4 border-[#ffd700] animate-ping pointer-events-none opacity-60 duration-1000" />
            )}

            {/* Center Anchor: Current User Location */}
            <div className="absolute z-20 flex flex-col items-center pointer-events-none">
              <div className="h-4 w-4 rounded-full bg-[#ffd700] shadow-[0_0_15px_#ffd700] border-2 border-white flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#3e1b34]" />
              </div>
              <span className="mt-1 text-[9px] font-bold text-[#ffd700] bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                YOU
              </span>
            </div>

            {/* Campus cluster markers on the radar */}
            {radarNodes.map(node => {
              const coords = getBlipCoordinates(node.distanceKm, node.bearing);
              return (
                <div
                  key={node.id}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none group"
                >
                  <div className="flex flex-col items-center opacity-70">
                    <div className="h-2 w-2 rounded-full bg-[#9c7191] border border-white/50" />
                    <span className="text-[8px] font-semibold text-[#d4c1cf] tracking-tight whitespace-nowrap bg-black/50 px-1 rounded-xs">
                      {node.shortName} ({node.activeCount})
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Student Blips */}
            {profiles.map(p => {
              const coords = getBlipCoordinates(p.distanceKm || 15, p.radarBearing || 45);
              const isSelected = selectedBlipProfile?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedBlipProfile(p)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none transition-transform hover:scale-125"
                  title={p.showApproximateArea && p.distanceKm !== undefined ? `${p.displayName} · ~${p.distanceKm} km (approx.)` : `${p.displayName} · Location Private · Campus Verified`}
                >
                  <div className="relative">
                    {/* Pulsing ring around student blip */}
                    <span className={`absolute -inset-1.5 rounded-full ${isSelected ? 'bg-[#ffd700] animate-ping opacity-75' : 'bg-[#e26d91] opacity-40 animate-pulse'}`} />
                    <div className={`relative h-6 w-6 rounded-full overflow-hidden border-2 shadow-md ${isSelected ? 'border-[#ffd700] ring-2 ring-[#ffd700]' : 'border-white'}`}>
                      <img
                        src={p.photos[0]?.url || '/logo.svg'}
                        alt={p.displayName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </button>
              );
            })}

          </div>

          {/* Radar Legend and Range Indicators */}
          <div className="w-full pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-[#dec5d6] gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#ffd700]" />
                <span>Your Location</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#e26d91]" />
                <span>Active Peers ({profiles.length})</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#9c7191]" />
                <span>Campus Hub</span>
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#ffd700]">
              Radius: {filters.radiusKm === 'all' || !filters.radiusKm ? 'National Kenya' : `${filters.radiusKm} km`}
            </div>
          </div>

        </div>

        {/* Selected Blip Card + Intra-University Filter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Preview Card if Blip Selected */}
          {selectedBlipProfile ? (
            <div className="rounded-3xl border border-[#d4af37] bg-white p-5 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#fef7e0] px-2.5 py-0.5 text-[10px] font-bold text-[#8a6d1c] border border-[#d4af37]/40">
                    🎯 Proximity Detected
                  </span>
                  <span className="text-xs font-mono font-bold text-[#2e7d32] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ~{selectedBlipProfile.distanceKm ?? 3.2} km away
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBlipProfile(null)}
                  className="text-xs text-[#887082] hover:text-[#49233f] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={selectedBlipProfile.photos[0]?.url || '/logo.svg'}
                  alt={selectedBlipProfile.displayName}
                  className="h-16 w-16 rounded-2xl object-cover border border-[#e5d6c8] shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#49233f] truncate">
                    {selectedBlipProfile.displayName}, {selectedBlipProfile.age}
                  </h3>
                  <p className="text-xs text-[#b64d70] font-semibold truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 inline" />
                    <span>{selectedBlipProfile.locationArea || selectedBlipProfile.campusZone || 'Nairobi Central'}</span>
                  </p>
                  {selectedBlipProfile.occupation && (
                    <p className="text-[11px] text-[#786172] truncate">
                      {selectedBlipProfile.occupation}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#523d4c] line-clamp-2 italic leading-relaxed">
                "{selectedBlipProfile.bio}"
              </p>

              <div className="flex gap-2 pt-1 border-t border-[#f0e6dc]">
                <button
                  onClick={() => onLike(selectedBlipProfile, 'like')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#b64d70] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#973a58] transition-all cursor-pointer"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  <span>Connect & Chat</span>
                </button>
                <button
                  onClick={() => onSelectProfile(selectedBlipProfile)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-[#ded3c5] bg-[#faf6f2] px-3 py-2 text-xs font-semibold text-[#49233f] hover:bg-[#f0e6dc] transition-all cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#ded3c5] bg-[#fffdf9] p-5 text-center text-xs text-[#887082] space-y-1">
              <Compass className="h-6 w-6 mx-auto text-[#b64d70]" />
              <p className="font-semibold text-[#49233f]">Click any blip on the distance radar</p>
              <p className="text-[11px] text-[#786172]">Inspect estimated distance, neighborhood location, and connect directly.</p>
            </div>
          )}

          {/* Proximity & Distance Filters Card */}
          <div className="rounded-3xl border border-[#ded3c5] bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0e6dc] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#b64d70]" />
                <h3 className="font-serif text-base font-bold text-[#49233f]">
                  Distance & Proximity Filters
                </h3>
              </div>
              <button
                onClick={() => onFilterChange({
                  intent: 'all',
                  gender: 'all',
                  radiusKm: 'all',
                  locationArea: 'all',
                  region: 'all'
                })}
                className="text-[11px] font-semibold text-[#b64d70] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* 1. Maximum Distance Radius */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#49233f] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#887082]" />
                <span>Maximum Distance Range</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: '3', label: '3 km · Walking' },
                  { id: '10', label: '10 km · Local' },
                  { id: '25', label: '25 km · Metro' },
                  { id: '50', label: '50 km · Greater' },
                  { id: 'all', label: 'Any Distance' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onFilterChange({ ...filters, radiusKm: opt.id })}
                    className={`rounded-xl py-2 px-2 text-[11px] font-semibold text-center transition-all cursor-pointer ${
                      String(filters.radiusKm || 'all') === opt.id
                        ? 'bg-[#49233f] text-white shadow-xs'
                        : 'bg-[#faf6f2] text-[#6b5263] border border-[#e8ded3] hover:bg-[#f0e6dc]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Neighborhood Area Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#49233f] flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#887082]" />
                <span>Neighborhood / Area</span>
              </label>
              <select
                value={filters.locationArea || 'all'}
                onChange={e => onFilterChange({ ...filters, locationArea: e.target.value })}
                className="w-full rounded-xl border border-[#ded3c5] bg-white px-3.5 py-2 text-xs font-semibold text-[#49233f] shadow-xs cursor-pointer focus:border-[#b64d70] focus:outline-none"
              >
                <option value="all">All Neighborhoods & Towns</option>
                <optgroup label="Nairobi Metropolitan">
                  <option value="Westlands">Westlands / Riverside</option>
                  <option value="Kilimani">Kilimani / Hurlingham</option>
                  <option value="CBD">CBD / Central</option>
                  <option value="Roysambu">Roysambu / Kasarani / Thika Rd</option>
                  <option value="Karen">Karen / Lang'ata</option>
                </optgroup>
                <optgroup label="Coast & Western">
                  <option value="Mombasa">Mombasa & Nyali</option>
                  <option value="Kisumu">Kisumu City & Milimani</option>
                  <option value="Eldoret">Eldoret Town</option>
                  <option value="Nakuru">Nakuru City</option>
                </optgroup>
              </select>
            </div>

            {/* 3. Connection Intent */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#49233f]">Connection Intent</label>
              <select
                value={filters.intent || 'all'}
                onChange={e => onFilterChange({ ...filters, intent: e.target.value })}
                className="w-full rounded-xl border border-[#ded3c5] bg-white px-3.5 py-2 text-xs font-semibold text-[#49233f] shadow-xs cursor-pointer focus:border-[#b64d70] focus:outline-none"
              >
                <option value="all">All Intentions</option>
                <option value="casual">Casual Hookups & Meetups</option>
                <option value="dating">Adult Dating</option>
                <option value="open">Discreet / Open-minded</option>
                <option value="meet-people">Meet & Hang Out</option>
              </select>
            </div>

            {/* 4. Faculty / Study Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#49233f] flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#887082]" />
                <span>Faculty / Discipline</span>
              </label>
              <select
                value={filters.faculty || 'all'}
                onChange={e => onFilterChange({ ...filters, faculty: e.target.value })}
                className="w-full rounded-xl border border-[#ded3c5] bg-white px-3.5 py-2 text-xs font-semibold text-[#49233f] shadow-xs cursor-pointer focus:border-[#b64d70] focus:outline-none"
              >
                <option value="all">All Disciplines & Faculties</option>
                <option value="Health Sciences & Medicine">Health Sciences & Medicine</option>
                <option value="Engineering & Tech">Engineering, Tech & Architecture</option>
                <option value="Law & Legal Studies">Law & Legal Studies</option>
                <option value="Business & Economics">Business, Economics & Finance</option>
                <option value="Media & Humanities">Media, Film & Humanities</option>
                <option value="Agribusiness & Sciences">Agribusiness & Applied Sciences</option>
              </select>
            </div>

            {/* 5. Academic Year Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#49233f] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#887082]" />
                <span>Academic Seniority</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: '2nd Year', label: '2nd Yr' },
                  { id: '3rd Year', label: '3rd Yr' },
                  { id: 'Finalist', label: 'Finalist' }
                ].map(yr => (
                  <button
                    key={yr.id}
                    onClick={() => onFilterChange({ ...filters, academicYear: yr.id })}
                    className={`rounded-xl py-1.5 text-[11px] font-semibold text-center transition-all cursor-pointer ${
                      (filters.academicYear || 'all') === yr.id
                        ? 'bg-[#b64d70] text-white shadow-xs'
                        : 'bg-[#faf6f2] text-[#6b5263] border border-[#e8ded3] hover:bg-[#f0e6dc]'
                    }`}
                  >
                    {yr.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
