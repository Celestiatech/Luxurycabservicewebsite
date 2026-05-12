'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { MapPin, Map as MapIcon, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputId?: string;
}

export function LocationAutocomplete({ placeholder, value, onChange, className, inputId }: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [osmResults, setOsmResults] = useState<string[]>([]);
  const [osmOpen, setOsmOpen] = useState(false);
  const osmReqId = useRef(0);
  const osmAbort = useRef<AbortController | null>(null);
  const lastOsmQuery = useRef<string>('');

  const googleMapsApiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '').trim();
  const debug = (process.env.NEXT_PUBLIC_DEBUG_MAPS || '').trim() === '1';

  const mapsReady = useMemo(() => {
    if (!googleMapsApiKey) return null;
    setOptions({ key: googleMapsApiKey, v: 'weekly' });
    return Promise.resolve();
  }, [googleMapsApiKey]);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;
    let placeListener: google.maps.MapsEventListener | null = null;

    if (!mapsReady || !inputRef.current) return;

    mapsReady
      .then(async () => {
        await importLibrary('places');
        if (!inputRef.current) return;
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, { fields: ['formatted_address', 'name'] });

        placeListener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete?.getPlace();
          const text = place?.formatted_address || place?.name;
          if (text) onChange(text);
        });
      })
      .catch(() => {
        if (debug) console.warn('[Maps] Failed to load Places library');
      });

    return () => {
      if (placeListener) placeListener.remove();
      autocomplete = null;
    };
  }, [mapsReady, onChange, debug]);

  // Free alternative: OpenStreetMap Nominatim suggestions via our server proxy
  useEffect(() => {
    if (googleMapsApiKey) return;

    const q = value.trim();
    if (q.length < 3) {
      setOsmResults([]);
      setOsmOpen(false);
      lastOsmQuery.current = '';
      if (osmAbort.current) osmAbort.current.abort();
      return;
    }

    // Only search after the user stops typing for a moment.
    const id = ++osmReqId.current;
    const t = window.setTimeout(async () => {
      const query = q;
      if (query === lastOsmQuery.current) return;
      lastOsmQuery.current = query;

      if (osmAbort.current) osmAbort.current.abort();
      const controller = new AbortController();
      osmAbort.current = controller;

      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const json = (await res.json().catch(() => null)) as { results?: string[] } | null;
        if (id !== osmReqId.current) return;
        const results = Array.isArray(json?.results) ? json!.results!.slice(0, 6) : [];
        setOsmResults(results);
        setOsmOpen(results.length > 0);
      } catch {
        if (id !== osmReqId.current) return;
        setOsmResults([]);
        setOsmOpen(false);
      }
    }, 550);

    return () => window.clearTimeout(t);
  }, [value, googleMapsApiKey]);

  useEffect(() => {
    if (!showMapPicker || !mapsReady || !mapRef.current) return;

    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;
    let clickListener: google.maps.MapsEventListener | null = null;

    mapsReady
      .then(async () => {
        await importLibrary('maps');
        await importLibrary('marker');
        await importLibrary('geocoding');
        if (!mapRef.current) return;
        const geocoder = new google.maps.Geocoder();

        map = new google.maps.Map(mapRef.current, {
          center: { lat: -36.8485, lng: 174.7633 }, // Auckland default
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
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
  }, [showMapPicker, mapsReady, onChange, debug]);

  return (
    <>
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500 z-10" />
      <Input
        ref={inputRef}
        id={inputId}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (!googleMapsApiKey && osmResults.length) setOsmOpen(true);
        }}
        onBlur={() => {
          // allow click on dropdown
          window.setTimeout(() => setOsmOpen(false), 150);
        }}
        className={`pl-12 pr-12 font-semibold border-2 ${className ? className : ''}`}
      />

      {googleMapsApiKey ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowMapPicker(true)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-10 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          aria-label="Pick from map"
          title="Pick from map"
        >
          <MapIcon className="w-5 h-5" />
        </Button>
      ) : null}

      {!googleMapsApiKey && osmOpen ? (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-yellow-200 rounded-md shadow-xl z-[99999] overflow-hidden">
          {osmResults.map((r) => (
            <button
              key={r}
              type="button"
              className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-yellow-50"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(r);
                setOsmOpen(false);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      ) : null}
    </div>

    {googleMapsApiKey && debug ? (
      <div className="mt-1 text-xs font-semibold text-gray-600">
        Maps debug: key loaded, waiting for Places suggestions…
      </div>
    ) : null}

    {showMapPicker && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black">Pick location from map</CardTitle>
            <Button type="button" variant="ghost" onClick={() => setShowMapPicker(false)} className="h-9 w-9 p-0">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold text-gray-600 mb-3">
              Click on the map to select a location.
            </div>
            <div ref={mapRef} className="w-full h-[420px] rounded-lg border-2 border-yellow-200" />
          </CardContent>
        </Card>
      </div>
    )}
    </>
  );
}
