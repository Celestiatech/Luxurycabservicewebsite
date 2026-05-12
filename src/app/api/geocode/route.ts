import { NextResponse } from 'next/server';

type OpenMeteoGeocodingResponse = {
  results?: { name?: string; admin1?: string; country?: string }[];
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();
  const debug = url.searchParams.get('debug') === '1' || process.env.DEBUG_GEOCODE === '1';

  if (q.length < 3) return NextResponse.json({ results: [] });

  try {
    // Free alternative without API key.
    // Open-Meteo Geocoding API is typically more permissive than public Nominatim endpoints.
    const upstream = new URL('https://geocoding-api.open-meteo.com/v1/search');
    upstream.searchParams.set('name', q);
    upstream.searchParams.set('count', '6');
    upstream.searchParams.set('language', 'en');
    upstream.searchParams.set('format', 'json');

    const res = await fetch(upstream.toString(), {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        debug ? { results: [], debug: { upstreamStatus: res.status, upstreamUrl: upstream.toString() } } : { results: [] },
        { status: 200 },
      );
    }

    const text = await res.text();
    const data = (JSON.parse(text) as OpenMeteoGeocodingResponse) || {};
    const results = (Array.isArray(data.results) ? data.results : [])
      .map((r) => [r.name, r.admin1, r.country].filter(Boolean).join(', '))
      .filter((name) => name.trim().length > 0);

    return NextResponse.json(
      debug
        ? { results, debug: { upstreamStatus: res.status, upstreamUrl: upstream.toString(), sample: text.slice(0, 200) } }
        : { results },
    );
  } catch {
    return NextResponse.json(debug ? { results: [], debug: { error: 'fetch_failed' } } : { results: [] }, { status: 200 });
  }
}
