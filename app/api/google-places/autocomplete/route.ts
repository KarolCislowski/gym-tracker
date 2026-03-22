import { NextResponse } from 'next/server';

import { searchGooglePlaceSuggestions } from '@/features/profile/infrastructure/google-places';

/**
 * Proxies Google Places autocomplete results so the API key stays server-side.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input') ?? '';

  if (input.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await searchGooglePlaceSuggestions(input);

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'GOOGLE_PLACES_AUTOCOMPLETE_ERROR',
        suggestions: [],
      },
      { status: 500 },
    );
  }
}
