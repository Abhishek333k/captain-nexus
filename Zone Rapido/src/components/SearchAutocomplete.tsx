import React, { useState, useEffect, useRef } from 'react';
import { RAPIDO_OFFICIAL_CITIES, City } from '../data/cities';

export interface SuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  type: 'official_city' | 'geocoded_place';
  isActive?: boolean;
}

interface SearchAutocompleteProps {
  onSelectLocation: (loc: { name: string; lat: number; lng: number }) => void;
  isSearching: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  cities?: City[];
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelectLocation,
  isSearching,
  inputRef,
  cities = RAPIDO_OFFICIAL_CITIES
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef || internalInputRef;
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions debouncer with disambiguation for identically named locations
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel any inflight API requests to prevent race conditions & duplicate calls
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 1. Instant local matching for registered cities (active & inactive)
    const localMatches: SuggestionItem[] = (cities || RAPIDO_OFFICIAL_CITIES)
      .filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.state.toLowerCase().includes(trimmed) ||
          (c.notes && c.notes.toLowerCase().includes(trimmed)) ||
          (c.address && c.address.toLowerCase().includes(trimmed))
      )
      .slice(0, 4)
      .map((c) => ({
        id: `city-${c.id}`,
        title: c.name,
        subtitle: `${c.state} • ${c.active ? 'Operational Hub' : 'Inactive Service Zone'}`,
        lat: c.lat,
        lng: c.lng,
        type: 'official_city',
        isActive: c.active
      }));

    setSuggestions(localMatches);
    setIsOpen(localMatches.length > 0);
    setHighlightIndex(-1);

    // 2. Query free OpenStreetMap Nominatim with address details & 5s timeout
    const debounceTimer = setTimeout(async () => {
      const timeoutId = setTimeout(() => abortController.abort(), 5000);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed + ', India'
          )}&countrycodes=in&limit=5&addressdetails=1&accept-language=en`,
          { signal: abortController.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const externalMatches: SuggestionItem[] = data.map((item: any) => {
            const rawName = item.name || item.display_name.split(',')[0].trim();
            const district =
              item.address?.county ||
              item.address?.state_district ||
              item.address?.district ||
              '';
            const state = item.address?.state || '';
            const postcode = item.address?.postcode ? `PIN: ${item.address.postcode}` : '';

            // Disambiguate identical place names with district & state
            const cleanDistrict = district.replace(/\s*district\s*/i, '').trim();
            const qualifier = [cleanDistrict, state].filter(Boolean).join(', ');
            const title =
              qualifier && !rawName.toLowerCase().includes(cleanDistrict.toLowerCase())
                ? `${rawName} (${qualifier})`
                : rawName;

            const subtitleParts = [district, state, postcode].filter(Boolean);
            const subtitle = subtitleParts.length > 0 ? subtitleParts.join(' • ') : item.display_name;

            return {
              id: `geo-${item.place_id}`,
              title,
              subtitle,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: 'geocoded_place'
            };
          });

          setSuggestions(() => {
            const combined = [...localMatches];
            externalMatches.forEach((ext) => {
              if (
                !combined.some(
                  (c) => Math.abs(c.lat - ext.lat) < 0.03 && Math.abs(c.lng - ext.lng) < 0.03
                )
              ) {
                combined.push(ext);
              }
            });
            return combined.slice(0, 6);
          });
          setIsOpen(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback silently without throwing
        }
      }
    }, 280);

    return () => {
      clearTimeout(debounceTimer);
      abortController.abort();
    };
  }, [query, cities]);

  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.title);
    setIsOpen(false);
    onSelectLocation({
      name: item.title,
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
          ref={resolvedInputRef}
          type="text"
          placeholder="Search village, town, district, city or pincode... (Ctrl+F)"
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
            className="px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors disabled:opacity-40 h-full flex items-center justify-center cursor-pointer"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Disambiguated Autocomplete Dropdown */}
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
                  <span className="text-sm shrink-0">
                    {item.type === 'official_city' ? (item.isActive ? '🟡' : '⚪') : '📍'}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold block truncate text-slate-100">{item.title}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.subtitle}</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    item.type === 'official_city'
                      ? item.isActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.type === 'official_city'
                    ? item.isActive
                      ? 'Active Hub'
                      : 'Inactive'
                    : 'Location'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
