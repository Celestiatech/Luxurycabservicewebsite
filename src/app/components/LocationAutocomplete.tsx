'use client';

import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { MapPin, Map as MapIcon, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type LocationData = { name: string; region: string; area: string }[];
type Suggestion = {
  id: string;
  value: string;
  label: string;
  source: 'google' | 'csv';
};

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputId?: string;
}

const NEW_ZEALAND_BOUNDS = {
  north: -34.0,
  south: -47.5,
  west: 166.0,
  east: 179.5,
};

export function LocationAutocomplete({ placeholder, value, onChange, className, inputId }: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapsReadyRef = useRef<Promise<void> | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const requestIdRef = useRef(0);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [csvData, setCsvData] = useState<LocationData>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const googleMapsApiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '').trim();
  const debug = (process.env.NEXT_PUBLIC_DEBUG_MAPS || '').trim() === '1';

  if (googleMapsApiKey && !mapsReadyRef.current) {
    setOptions({ key: googleMapsApiKey, v: 'weekly', region: 'NZ' });
    mapsReadyRef.current = Promise.resolve();
  }

  const buildNzBounds = () =>
    new google.maps.LatLngBounds(
      new google.maps.LatLng(NEW_ZEALAND_BOUNDS.south, NEW_ZEALAND_BOUNDS.west),
      new google.maps.LatLng(NEW_ZEALAND_BOUNDS.north, NEW_ZEALAND_BOUNDS.east),
    );

  const buildCsvSuggestions = (query: string, limit = 8): Suggestion[] =>
    csvData
      .filter((loc) => loc.name.toLowerCase().includes(query))
      .map((loc) => ({
        id: `csv-${loc.name}-${loc.region}`,
        value: `${loc.name}, ${loc.region}`,
        label: `${loc.name}, ${loc.region}`,
        source: 'csv' as const,
      }))
      .filter((item, index, self) => self.findIndex((entry) => entry.value === item.value) === index)
      .slice(0, limit);

  const selectSuggestion = (nextValue: string) => {
    onChange(nextValue);
    setSuggestionsOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (!googleMapsApiKey || !mapsReadyRef.current) return;

    mapsReadyRef.current
      .then(async () => {
        await importLibrary('places');
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      })
      .catch(() => {
        if (debug) console.warn('[Maps] Failed to load Places library');
      });

    return () => {
      autocompleteServiceRef.current = null;
      sessionTokenRef.current = null;
    };
  }, [googleMapsApiKey, debug]);

  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const res = await fetch('/nz-locations.csv');
        const text = await res.text();
        const lines = text.trim().split('\n');
        const data: LocationData = [];

        for (let i = 1; i < lines.length; i++) {
          const [name, region, area] = lines[i].split(',').map((s) => s.trim());
          if (name && region && area) {
            data.push({ name, region, area });
          }
        }

        setCsvData(data);
      } catch (error) {
        console.error('Failed to load location data:', error);
      }
    };

    loadCsvData();
  }, []);

  useEffect(() => {
    if (csvData.length === 0) return;

    const query = value.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      if (currentRequestId !== requestIdRef.current) return;

      const csvSuggestions = buildCsvSuggestions(query, googleMapsApiKey ? 4 : 8);

      if (!googleMapsApiKey || !autocompleteServiceRef.current) {
        setSuggestions(csvSuggestions);
        setSuggestionsOpen(csvSuggestions.length > 0);
        setActiveIndex(-1);
        return;
      }

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value.trim(),
          componentRestrictions: { country: 'nz' },
          bounds: buildNzBounds(),
          sessionToken: sessionTokenRef.current || undefined,
        },
        (predictions, status) => {
          if (currentRequestId !== requestIdRef.current) return;

          const googleSuggestions =
            status === google.maps.places.PlacesServiceStatus.OK && predictions
              ? predictions.slice(0, 6).map((prediction) => ({
                  id: prediction.place_id,
                  value: prediction.description,
                  label: prediction.description,
                  source: 'google' as const,
                }))
              : [];

          const seen = new Set(googleSuggestions.map((item) => item.value.toLowerCase()));
          const merged = [
            ...googleSuggestions,
            ...csvSuggestions.filter((item) => !seen.has(item.value.toLowerCase())),
          ].slice(0, 8);

          setSuggestions(merged);
          setSuggestionsOpen(merged.length > 0);
          setActiveIndex(-1);
        },
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [value, csvData, googleMapsApiKey]);

  useEffect(() => {
    if (!showMapPicker || !mapsReadyRef.current || !mapRef.current) return;

    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;
    let clickListener: google.maps.MapsEventListener | null = null;

    mapsReadyRef.current
      .then(async () => {
        await importLibrary('maps');
        await importLibrary('marker');
        await importLibrary('geocoding');
        if (!mapRef.current) return;
        const geocoder = new google.maps.Geocoder();

        map = new google.maps.Map(mapRef.current, {
          center: { lat: -36.8485, lng: 174.7633 },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          restriction: {
            latLngBounds: NEW_ZEALAND_BOUNDS,
            strictBounds: true,
          },
        });

        marker = new google.maps.Marker({ map });

        clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const latLng = e.latLng;
          if (!latLng) return;
          marker?.setPosition(latLng);

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]?.formatted_address) {
              onChange(results[0].formatted_address);
              setShowMapPicker(false);
            }
          });
        });
      })
      .catch(() => {
        if (debug) console.warn('[Maps] Failed to load map/geocoding libraries');
      });

    return () => {
      if (clickListener) clickListener.remove();
      marker?.setMap(null);
      map = null;
      marker = null;
    };
  }, [showMapPicker, onChange, debug]);

  return (
    <>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 z-10 w-5 -translate-y-1/2 text-yellow-500" />
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (!suggestions.length) return;

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSuggestionsOpen(true);
              setActiveIndex((prev) => (prev + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSuggestionsOpen(true);
              setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
            } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < suggestions.length) {
              e.preventDefault();
              selectSuggestion(suggestions[activeIndex].value);
            } else if (e.key === 'Escape') {
              setSuggestionsOpen(false);
              setActiveIndex(-1);
            }
          }}
          onFocus={() => {
            if (suggestions.length) setSuggestionsOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => setSuggestionsOpen(false), 150);
          }}
          className={`pl-12 pr-12 font-semibold border-2 ${className ? className : ''}`}
        />

        {googleMapsApiKey ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowMapPicker(true)}
            className="absolute right-1 top-1/2 h-9 w-10 -translate-y-1/2 p-0 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
            aria-label="Pick from map"
            title="Pick from map"
          >
            <MapIcon className="h-5 w-5" />
          </Button>
        ) : null}

        {suggestionsOpen ? (
          <div className="absolute left-0 right-0 top-full z-[99999] mt-1 overflow-hidden rounded-md border-2 border-yellow-200 bg-white shadow-xl">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm font-semibold hover:bg-yellow-50 ${
                  index === activeIndex ? 'bg-yellow-50' : ''
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  selectSuggestion(suggestion.value);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{suggestion.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">
                    {suggestion.source === 'google' ? 'Maps' : 'Local'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {googleMapsApiKey && debug ? (
        <div className="mt-1 text-xs font-semibold text-gray-600">
          Maps debug: key loaded, waiting for Places suggestions...
        </div>
      ) : null}

      {showMapPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black">Pick location from map</CardTitle>
              <Button type="button" variant="ghost" onClick={() => setShowMapPicker(false)} className="h-9 w-9 p-0">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-sm font-semibold text-gray-600">
                Click on the map to select a location.
              </div>
              <div ref={mapRef} className="h-[420px] w-full rounded-lg border-2 border-yellow-200" />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
