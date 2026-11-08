import React, { useState, useEffect, useRef } from 'react';
import { RAPIDO_OFFICIAL_CITIES } from '../data/cities';

export interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  type: 'official_city' | 'geocoded_place';
}

interface SearchAutocompleteProps {
  onSelectLocation: (loc: { name: string; lat: number; lng: number }) => void;
  isSearching: boolean;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelectLocation,
  isSearching
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions debouncer with Telugu localization & 100% free OSM Nominatim (Zero Google Maps API keys)
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // 1. Instant local matching for official Rapido cities (Supports English or Telugu script typing)
    const localMatches: SuggestionItem[] = RAPIDO_OFFICIAL_CITIES
      .filter((c) => c.name.toLowerCase().includes(trimmed) || c.state.toLowerCase().includes(trimmed))
      .slice(0, 4)
      .map((c) => ({
        id: `city-${c.id}`,
        title: c.name,
        subtitle: `${c.state} • అధికారిక సర్వీస్ కేంద్రం (Official Hub)`,
        lat: c.lat,
        lng: c.lng,
        type: 'official_city'
      }));

    setSuggestions(localMatches);
    setIsOpen(localMatches.length > 0);
    setHighlightIndex(-1);

    // 2. Query free OpenStreetMap Nominatim with accept-language=te (Telugu primary)
    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed + ', India'
          )}&countrycodes=in&limit=4&addressdetails=1&accept-language=te`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const externalMatches: SuggestionItem[] = data.map((item: any) => ({
            id: `geo-${item.place_id}`,
            title: item.name || item.display_name.split(',')[0],
            subtitle: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: 'geocoded_place'
          }));

          setSuggestions(() => {
            const combined = [...localMatches];
            externalMatches.forEach((ext) => {
              if (!combined.some((c) => Math.abs(c.lat - ext.lat) < 0.05 && Math.abs(c.lng - ext.lng) < 0.05)) {
                combined.push(ext);
              }
            });
            return combined.slice(0, 6);
          });
          setIsOpen(true);
        }
      } catch {
        // Fallback silently
      }
    }, 280);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.title);
    setIsOpen(false);
    onSelectLocation({
      name: item.type === 'official_city' ? `${item.title}, ${item.subtitle.split('•')[0].trim()}` : item.subtitle,
      lat: item.lat,
      lng: item.lng
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSelect(suggestions[highlightIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="గ్రామం, పట్టణం, నగరం లేదా పిన్ కోడ్ సెర్చ్ చేయండి..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner pr-20"
        />

        <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-300 text-xs px-1.5"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (suggestions.length > 0) {
                handleSelect(suggestions[0]);
              }
            }}
            disabled={isSearching || !query.trim()}
            className="px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors disabled:opacity-40 h-full flex items-center justify-center"
          >
            {isSearching ? '...' : 'శోధించు'}
          </button>
        </div>
      </div>

      {/* Suggestive Autocomplete Dropdown in Telugu */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 backdrop-blur-md">
          {suggestions.map((item, idx) => {
            const isHighlighted = idx === highlightIndex;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHighlightIndex(idx)}
                onClick={() => handleSelect(item)}
                className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                  isHighlighted ? 'bg-amber-400/15 text-amber-200' : 'hover:bg-slate-800/80 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <span className="text-sm">
                    {item.type === 'official_city' ? '🟡' : '📍'}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold block truncate text-slate-100">{item.title}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.subtitle}</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    item.type === 'official_city'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.type === 'official_city' ? 'యాక్టివ్ సిటీ' : 'ప్రాంతం'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
